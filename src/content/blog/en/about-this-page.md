---
title: About this page
date: 2023-10-31
tags: ["tech"]
---

I originally created this page for professional and labor-related purposes. The first pages were resume, about me and projects. Only afterwards did I start adding more personal ones like likes and blog posts. Even the about me section has a professional rather than personal focus, I plan to update it in the future.

Although I didn't plan to write much at first, I wanted to leave the option open for the future in case I changed my mind and/or got the hang of writing. For this reason it was created with [Jekyll](https://jekyllrb.com/). I tried other options like [Hugo](https://gohugo.io/) but in the end I ended up being convinced by Jekyll due to its ease of use and diversity of accessories.

To be able to display the content in spanish and english I use [jekyll-multiple-languages-plugin](https://github.com/kurtsson/jekyll-multiple-languages-plugin). It was a little difficult at first to configure it to my liking but I am already satisfied with the result.

I wanted to avoid using JavaScript as much as possible to focus only on the content of the page in terms of the blog and as a way to present myself as simple as possible through my projects, photos, likes, etc. So there is just a tiny script to toggle the sidebar visibility in mobile view. Perhaps it could be achieved with only HTML/CSS but considering that it is only 6 lines of code I found it easier to do it this way.

## Pictures

The images in [pictures](/pictures) and in [reading](/reading) are loaded lazily using `loading="lazy"` in each `img` and a minimum height (to prevent them all from being loaded at the same time; which happens because they have dimensions of 0x0 in the first instance when the `height` value is not specified). Also, I use `srcset` with two image options for each case, one for mobile and one for tablet/desktop, thus avoiding sending unnecessarily large images to small devices.

In order to reduce the weight of the images sent in the pictures section as much as possible before including them in the repository, I compress them using [Tinyjpg](https://tinyjpg.com/). A 235.8KB image with 1280px width is reduced to 166.4KB for example, **29%** less. It's worth the little effort. For a single image it may not be much but considering that in the future I would like to add as many images as I would like and we do not always have Wi-Fi available so as not to worry about the weight of the files received, it includes this extra step.

For the [photos](/es/photos) I use a custom [collection](https://jekyllrb.com/docs/collections/) since I wanted to have a markdown file for each one. Which allows me to add a title and an `alt` attribute for the Spanish and English versions of the page respectively.

## Hosting

I use [GitHub Pages](https://pages.github.com/) with a custom domain. The repository for the page can be found [here](https://github.com/luz-ojeda/luz-ojeda.github.io).

I configured GitHub actions so any push to the `master` branch triggers a build and deploy. Since I use `jekyll-multiple-languages-plugin` which I found out it is not present in GitHub Pages [set of allow-listed plugins](https://pages.github.com/versions/) I use the GitHub action [jekyll-deploy-action](https://github.com/jeffreytse/jekyll-deploy-action). The project is first built locally and then a commit is made to the branch `gh-pages` which in turn will trigger the publish to GitHub pages and show the latest changes.
