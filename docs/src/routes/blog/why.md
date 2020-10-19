---
title: 'Why Atlas Toolkit'
excerpt: ''
coverImage: '/assets/blog/preview/cover.jpg'
date: '2020-03-16T05:35:07.322Z'
author: Tom Wilson
---

## What is Atlas Toolkit?

Atlas Toolkit is a common API specification for interacting with application implementation details. So what is an API specification, it is a well-defined abstraction that creates a boundary between one system and another. What are implementation details? Implementation details are the general components or services that are required by your application and are reusable. For example, a datastore, a cache, a file store, a search service, an email service, a pub/sub queue, and sms service. These are all implementation details that may be required by your application.

## Why Atlas Toolkit?

Atlas Toolkit is a general abstraction layer between your business rules, or the reason your application is special to the implementation details or services required by your application to fully complete its purpose. When building application how do you address the concepts like `future-proof` or `anti-fragile`? How to you transition from idea to prototype to product v1 to product v2 to future proof product? That is the challenge is to create and transform an idea into a scalable and sustainable product. The Atlas Toolkit creates a boundary between your application rules and the implementation details so that you can effectively transition through a product lifecycle and minimize techinical debt.

<article><aside>

What is technical debt?

Techinical debt is the rough edges your software project accumlates over time as it acquires new features and different workflows and new technology. It can also be a result of architecture decisions made without the foresight of future use cases and directions. Technical Debt can accumulate in so many different ways and it results in the inability to develop with a fast flow over time.

</aside></article>

## How does Atlas Toolkit help with Technical Debt?

Atlas Toolkit gives your application an abstraction or boundary between your applications business rules and the implementation details of services your application will need. By creating this boundary your application can handle technology changes of implementation details without impacting your code base.

Think about some applications you built in the past, what if you were asked to move from one database system to another database system? what if a new technology came out for caching how would you replace your current caching system? what if you were asked to move from one cloud vendor to another cloud vendor? How much time an effort would it take for a common custom application. Lets take an angular application using rails, and mysql. What if you wanted to move to nodejs from rails, or if you wanted to move from mysql to postgres? What if you wanted to move from a monolith architecture to a micro-service architecture? All of these transformations can be extremely challenging, time consuming and costly. The goal of Atlas Toolkit is to make these transformations straight forward and as simple as possible, because over time things will change and you will want your application to be able to adapt to those changes.
