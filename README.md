# AWS DNS Updater

Gets server's external ip address and updates DNS records in AWS Route 53 accordingly. Uses `http://ifconfig.co` to get external ip address.


## Configuration

Create a `records.json` that includes the records to be updated, for example:

```
[
  { "name": "example.com", "type": "A" },
  { "name": "*.example.com", "type": "A" }
]
```

### Environment variables:

- `HOST_ZONE_ID`: AWS HostZoneId (required)
- `AWS_ACCESS_KEY_ID`: Used to access AWS
- `AWS_SECRET_ACCESS_KEY`: Used to access AWS
- `interval` : Interval to fetch external ip address (optional - default 5 minutes)

## Usage

Pre-requisite - make sure you have AWS CLI installed and configured

Install - `npm i`  
Configure - `echo [{"name":"example.com","type":"A"}] > records.json`  
Run - `HOST_ZONE_ID=<HOST_ZONE_ID> npm start`  

## Debugging

Debug - `DEBUG=aws-dns-updater HOST_ZONE_ID=<HOST_ZONE_ID> npm start`

## Docker

```
> build -t <my_tag> .
> docker run -d --name <container_name> \  
    --restart=always \
    -v ${PWD}/records.json:/www/records.json \
    -e HOST_ZONE_ID=<HOST_ZONE_ID> \   
    -e AWS_ACCESS_KEY_ID=<AWS_ACCESS_KEY_ID> \  
    -e AWS_SECRET_ACCESS_KEY=<AWS_SECRET_ACCESS_KEY> \
    <my_tag>
```
