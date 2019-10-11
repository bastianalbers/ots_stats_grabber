const fetch = require('node-fetch')
const args = require('yargs').argv

if (!args.year) {
  console.log('usage: node index.js --year=2019 --all')
  console.log('options --year: year to report on')
  console.log('options --all: show output for cities')
  process.exit()
}

const api_base = 'https://api.meetup.com'
const city_output = args.all || false
const year = args.year || 2018
const groups = [
  'CodeHub-Bristol',
  'opentechschool-berlin',
  'OpenTechSchool-Leipzig',
  'OpenTechSchool-Melbourne',
  'OpenTechSchool-Milano',
  'OpenTechSchool-Romagna',
  'opentechschool-brussels',
  'opentechschool-dortmund',
  'opentechschool-hamburg',
  'opentechschool-jerusalem',
  'opentechschool-london',
  'opentechschool-nairobi',
  'opentechschool-rheinmain',
  'opentechschool-san-francisco',
  'opentechschool-stockholm',
  'opentechschool-tel-aviv',
  'opentechschool-zurich'
]

const params = `no_later_than=${year}-12-31&no_earlier_than=${year}-01-01&page=200&fields=yes_rsvp_count&status=past`
let all_stats = []

// console.clear()

Promise.all(
  groups.map(group => {
    const url = `${api_base}/${group}/events?${params}`
    return fetch(url)
      .then(res => res.json())
      .then(data => {
        const event_count = data.length
        const rsvp_count = data
          .map(event => event.yes_rsvp_count)
          .reduce((p, c) => p + c, 0)
        all_stats.push({event_count, rsvp_count})
        if (city_output) {
          console.log('-------------------------')
          console.log(group)    
          console.log(`Year ${year} in ${group}`)
          console.log(`Total events that took place: ${event_count}`)
          console.log(`Total RSVPs ${rsvp_count}`)
          console.log(`Average RSVPs ${event_count > 0 ? (Math.round(100 * rsvp_count / event_count) / 100) : 0}`)
        }
      })
      .catch(e => {
        // console.log(e)
      })
}))
  .then(d => {
    const total_events = all_stats
      .map(as => as.event_count)
      .reduce((c, p) => c+p, 0)
    const total_rsvps = all_stats
      .map(as => as.rsvp_count)
      .reduce((c, p) => c+p, 0)
    console.log('----------------------------------')
    console.log('----------------------------------')
    console.log('----------------------------------')
    console.log(' ')
    console.log(' ')
    console.log(`Total events ${year}: ${total_events}`)
    console.log(`Total rsvps ${year}: ${total_rsvps}`)
    console.log(`Avarage rsvps ${year}: ${(Math.round(total_rsvps / total_events))}`)
    console.log(' ')
    console.log(' ')
    console.log('----------------------------------')
    console.log('----------------------------------')
    console.log('----------------------------------')
  })
