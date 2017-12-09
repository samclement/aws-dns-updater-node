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

- `id`: AWS HostZoneId (required)
- `interval` : Interval to fetch external ip address (optional - default 5 minutes)

## Usage

Install - `npm i`  
Configure - `echo [{"name":"example.com","type":"A"}] > records.json`  
Run - `HOST_ZONE_ID=<HOST_ZONE_ID> npm start`  

## Debugging

Debug - `DEBUG=aws-dns-updater HOST_ZONE_ID=<HOST_ZONE_ID> npm start`
