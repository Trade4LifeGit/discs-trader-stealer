# discs-trader-stealer

## How to run this masterpeace using docker
### 1. Install docker
### 2. Move to root folder and run command below. This command build docker image
```shell script
    docker build -t image-name:tag-name .
```
### 3. Run command below. This command run container based on this image
```shell script
    docker run -p 8080:8080 image-name:tag-name
```

## How to run this masterpeace locally
### 1.
```shell script
    npm install
```
### 2.
```shell script
    npm run start
```