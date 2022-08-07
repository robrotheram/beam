package main

import (
	"github.com/blevesearch/bleve/v2"
)

type SearchEngine struct {
	index bleve.Index
}

func getBleeve(config *Config) bleve.Index {
	index, err := bleve.Open(config.DBPATH)
	if err != nil {
		mapping := bleve.NewIndexMapping()
		index, err = bleve.New(config.DBPATH, mapping)
		if err != nil {
			panic(err)
		}
	}
	return index
}

func NewSearchEngine(config *Config) *SearchEngine {
	return &SearchEngine{
		index: getBleeve(config),
	}
}

func (se *SearchEngine) IndexDocument(doc *Site) {
	se.index.Index(doc.ID, doc)
	se.index.SetInternal([]byte(doc.ID), doc.Encode())
}

func (se *SearchEngine) Search(queryStr string) []*Site {
	sites := []*Site{}
	query := bleve.NewFuzzyQuery(queryStr)

	searchRequest := bleve.NewSearchRequest(query)
	searchRequest.Size = 30
	searchResult, _ := se.index.Search(searchRequest)
	for _, hit := range searchResult.Hits {
		raw, _ := se.index.GetInternal([]byte(hit.ID))
		sites = append(sites, NewSiteData(raw))
	}
	return sites
}
