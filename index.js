const AWS = require('aws-sdk')
const route53 = new AWS.Route53()
const axios = require('axios')
const debug = require('debug')('aws-dns-updater')

const interval = process.env.interval || 5
const HostedZoneId = process.env.HOST_ZONE_ID || ''
let lastUpdate = ''
let records = []

try {
  records = require('./records')
} catch (e) {
  console.log(e)
}

if (HostedZoneId === '')
  throw new Error('Environment variable `HOST_ZONE_ID` not provided')

pipeline()
setInterval(pipeline, interval * 60 * 1000)

function pipeline() {
  getMyIp()
    .then(parseIpAddress)
    .then(needsUpdating)
    .then(doUpdate)
    .catch(err => {
      console.log(err)
    })
}

function getMyIp() {
  debug(`get ip address`)
  return axios({
    method: 'GET',
    url: 'https://ifconfig.co/ip',
    headers: { 'User-Agent': `axios-${Math.random()}` }
  })
}

function parseIpAddress(resp) {
  debug(`ip: ${resp.data}`)
  return resp.data.trim()
}

function needsUpdating(ip) {
  const result = { ip, doUpdate: ip !== lastUpdate }
  debug(`needsUpdating: ${ip}, lastUpdate: ${lastUpdate}`)
  lastUpdate = ip
  return result
}

function doUpdate(obj) {
  debug(`doUpdate - ip: ${obj.ip}, doUpdate: ${obj.doUpdate}`)
  if (!obj.doUpdate) {
    console.log(`Up-to-date`)
  } else {
    const updateParams = getUpdateParams(obj.ip)
    debug(`updateParams: ${JSON.stringify(updateParams, null, 2)}`)
    route53.changeResourceRecordSets(updateParams, (err, res) => {
      if (err) console.log(err)
      else {
        console.log(`${res.ChangeInfo.Comment} - ip: ${obj.ip}`)
      }
    })
  }
}

function getChange(Name, Type, Value) {
  return {
    Action: 'UPSERT',
    ResourceRecordSet: {
      Name,
      Type,
      TTL: 300,
      ResourceRecords: [
        {
          Value
        }
      ]
    }
  }
}

function getUpdateParams(ip) {
  return {
    ChangeBatch: {
      Comment: `Upsert for ${records.map(r => r.name)}`,
      Changes: records.map(record => getChange(record.name, record.type, ip))
    },
    HostedZoneId
  }
}
