# -*- coding: utf-8 -*-
import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient
client = MongoClient('localhost', 27017)
db = client.db_moviestar

if __name__ == '__main__':
    headers = {'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
    url = "https://movie.naver.com/movie/sdb/rank/rpeople.naver?date=20100922&tg=1"
    data = requests.get(url, headers=headers)
    soup = BeautifulSoup(data.text, 'html.parser')

    actors = soup.select('#old_content > table > tbody > tr')
    actors_urls = []
    for actor in actors: 
        _actor_info = actor.select_one('.title>a')
        if _actor_info:
            _actor_url = _actor_info.attrs['href']
            actors_urls.append('https://movie.naver.com' + _actor_url)
    
    for url in actors_urls:
        data = requests.get(url, headers=headers)
        soup = BeautifulSoup(data.text, 'html.parser')
        actor_image = soup.select_one('#content > div.article > div.mv_info_area > div.poster > img')
        actor_name = soup.select_one('#content > div.article > div.mv_info_area > div.mv_info.character > h3 > a')
        actor_movies = soup.select_one('#content > div.article > div.mv_info_area > div.mv_info.character > dl > dt.step7 + dd')
        
        if actor_image:
            actor_image = actor_image.attrs['src']
        if actor_name:
            actor_name = actor_name.text.strip()
        if actor_movies:
            movies = []
            for a_tag in actor_movies.select('a'):
                if not 'class' in a_tag.attrs:
                    movies.append(a_tag.attrs['title'])
            actor_movies = movies
        
        result_document = {
            'name': actor_name,
            'movies': actor_movies,
            'url':url,
            'visible':True,
            'like':0,
            'image':actor_image
        }
        db.actors.insert_one(result_document)
        
