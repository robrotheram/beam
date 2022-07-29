package main

import (
	"bytes"
	"compress/gzip"
	"crypto/md5"
	"encoding/gob"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"

	"github.com/PuerkitoBio/goquery"
)

type Site struct {
	ID          string
	Title       string
	Type        string
	URL         string
	Description string
	Image       string
	UserID      string
	Public      bool
	Tags        []string
}

func delete_empty(s []string) []string {
	var r []string
	for _, str := range s {
		if str != "" && str != " " {
			r = append(r, str)
		}
	}
	return r
}

func NewSite(url string) *Site {
	return &Site{URL: url}
}

func NewSiteData(data []byte) *Site {
	site := &Site{}
	site.Decode(data)
	return site
}

func (site *Site) Get() (*goquery.Document, error) {
	res, err := http.Get(site.URL)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()
	if res.StatusCode != 200 {
		return nil, fmt.Errorf("status code error: %d %s", res.StatusCode, res.Status)
	}
	// Load the HTML document
	doc, err := goquery.NewDocumentFromReader(res.Body)
	if err != nil {
		return nil, err
	}
	return doc, nil
}

func removeDuplicateStr(strSlice []string) []string {
	allKeys := make(map[string]bool)
	list := []string{}
	for _, item := range strSlice {
		if _, value := allKeys[item]; !value {
			allKeys[item] = true
			list = append(list, item)
		}
	}
	return list
}

func (site *Site) GenerateID() {
	id := md5.Sum([]byte(site.URL))
	site.ID = fmt.Sprintf("%x", id)
}

func (site *Site) GenerateTags() {
	titleTags := (strings.Split(RemoveStopWords(site.Title), " "))
	descriptionTags := (strings.Split(RemoveStopWords(site.Description), " "))
	site.Tags = append(delete_empty(removeDuplicateStr(descriptionTags)), delete_empty(removeDuplicateStr(titleTags))...)
}

func (site *Site) Parse(doc *goquery.Document) {
	title, exits := doc.Find("meta[property='og:title']").Attr("content")
	if !exits {
		title = doc.Find("title").Text()
	}
	site.Title = title

	siteType, exits := doc.Find("meta[property='og:type']").Attr("content")
	if !exits {
		siteType = "website"
	}
	site.Type = siteType

	image, exits := doc.Find("meta[property='og:image']").Attr("content")
	if !exits {
		image, _ = doc.Find("meta[property='twitter:card']").Attr("content")
	}
	site.Image = image

	description, exits := doc.Find("meta[name='description']").Attr("content")
	if !exits {
		description, _ = doc.Find("meta[property='og:description']").Attr("content")
	}
	site.Description = description
}

func (site *Site) Build() (*Site, error) {
	doc, err := site.Get()
	if err != nil {
		fmt.Printf("Unable to get site, error %v", err)
		return nil, err
	}
	site.Parse(doc)
	site.GenerateTags()
	site.GenerateID()
	return site, nil
}

func (site *Site) Encode() []byte {
	buf := bytes.Buffer{}
	enc := gob.NewEncoder(&buf)
	err := enc.Encode(site)
	if err != nil {
		log.Fatal(err)
	}
	return buf.Bytes()
}

func (site *Site) CompressEncode() []byte {
	zipbuf := bytes.Buffer{}
	zipped := gzip.NewWriter(&zipbuf)
	zipped.Write(site.Encode())
	zipped.Close()
	fmt.Println("compressed size (bytes): ", len(zipbuf.Bytes()))
	return zipbuf.Bytes()
}

func (site *Site) Decode(b []byte) {
	dec := gob.NewDecoder(bytes.NewReader(b))
	err := dec.Decode(site)
	if err != nil {
		log.Fatal(err)
	}
}

func (site *Site) DecompressDecode(b []byte) {
	rdr, _ := gzip.NewReader(bytes.NewReader(b))
	data, err := ioutil.ReadAll(rdr)
	if err != nil {
		log.Fatal(err)
	}
	rdr.Close()
	fmt.Println("uncompressed size (bytes): ", len(data))
	site.Decode(data)
}

func (site *Site) Print() {
	fmt.Printf("Title: %s \n", site.Title)
	fmt.Printf("Type: %s \n", site.Type)
	fmt.Printf("URL: %s \n", site.URL)
	fmt.Printf("Image: %s \n", site.Image)
	fmt.Printf("Description: %s \n", site.Description)
	fmt.Printf("Tags: %s \n", site.Tags)
}
