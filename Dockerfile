FROM node:16 AS frontend
# set working directory
WORKDIR /app
COPY frontend .
RUN npm i
RUN npm run build

FROM golang:1.18 AS builder
WORKDIR /app
COPY --from=frontend /app/dist frontend/dist
COPY go.* ./
COPY *go ./
RUN go get
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o beam .

FROM alpine:latest  
RUN apk --no-cache add ca-certificates
WORKDIR /app/
COPY --from=builder /app/beam ./
COPY app.env.example ./app.env
CMD ["/app/beam"]  