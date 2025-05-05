const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const newspapers = [
    {
        name: 'cityam',
        address: 'https://www.cityam.com/category/crypto',
        base: ''
    },
    {
        name: 'thetimes',
        address: 'https://www.thetimes.com/uk',
        base: ''
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/technology/cryptocurrencies',
        base: '',
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/cryptocurrency',
        base: 'https://www.telegraph.co.uk',
    },
    {
        name: 'nyt',
        address: 'https://www.nytimes.com/search?query=crypto',
        base: 'https://www.nytimes.com',
    },
    {
        name: 'latimes',
        address: 'https://www.latimes.com/search?q=crypto&s=0',
        base: '',
    },
    {
        name: 'smh',
        address: 'https://www.smh.com.au/topic/cryptocurrencies-hpc',
        base: 'https://www.smh.com.au',
    },
    {
        name: 'bbc',
        address: 'https://www.bbc.com/news/topics/cyd7z4rvdm3t',
        base: 'https://www.bbc.co.uk',
    },
    {
        name: 'es',
        address: 'https://www.standard.co.uk/business/business-news',
        base: 'https://www.standard.co.uk'
    },
    {
        name: 'sun',
        address: 'https://www.thesun.ie/topic/cryptocurrency/',
        base: 'https://www.thesun.ie'
    },
    {
        name: 'dm',
        address: 'https://www.dailymail.co.uk/news/bitcoin/index.html',
        base: ''
    },
    {
        name: 'nyp',
        address: 'https://nypost.com/cryptocurrency/',
        base: ''
    },
    {
      name: 'crp',
      address: 'https://crypto.news/news/',
      base: ''
    }

]

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("crypto")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })

        })
})

app.get('/', (req, res) => {
    res.json('Welcome to my Crypto News API')
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base


    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("crypto")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))