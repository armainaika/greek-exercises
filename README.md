# greek_exercises

> a website, which creates an exercise from a greek text. currently only does exercises with verbs : )

![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-grey?logo=typescript)](https://typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-blue?logo=tailwindcss)](https://tailwindcss.com)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)

this repository contains:

- **backend:** FastAPI + Stanza
- **frontend:** Next.js app

## run locally using Docker

1. make sure you have Docker installed
2. run:

```
git clone https://github.com/your-username/greek-exercises.git
cd your-repo
docker-compose up --build
```

this will build and start both the backend and frontend containers

4. you can now check out the website on http://localhost:3000
5. to stop the containers, press Ctrl+C in the terminal and run:

```
docker-compose down
```

## goals

- i am passionate about learning languages and currently i am learning greek. i wanted to create verb exercises out of some texts so i created this website
- in the future i would like to make it possible to choose what different kinds of exercises the user wants

## challenges

- stanza is not always perfect so there may be some mistakes
- at first i was planning on publishing my python backend api somewhere but stanza is heavy on memory so i decided to go with docker
- docker is a new thing to me so i learned it through this project : )

## features

### current features

- lets user input any greek text
- outputs an exercise, which you can either do on the website and check your answers afterwards or you can create a print-ready pdf file with the exercise

### future features

- let user choose what parts of speech to make the exercise with
- for mistaken words: create backup (maybe with some ai?...) that checks if the verb found is **really a verb**

**i am always learning new stuff so if i did something wrong i would like to know about that and learn from that so i am always open for comments! thanks for checking out my project :)**
