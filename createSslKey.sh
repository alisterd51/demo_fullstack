#!/bin/sh

openssl req -new					\
		-newkey rsa:4096			\
		-x509						\
		-sha256						\
		-days 365					\
		-nodes						\
		-out ./nginx/cert.crt		\
		-keyout ./nginx/cert.key	\
		-subj "/C=FR/ST=France/L=Paris/O=42/CN=anclarma"
