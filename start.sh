#!/usr/bin/env bash
node src/watchfolder.js \
	--CP=VRT \
	--FLOW_ID=VRT.VIDEO.1 \
	--ESSENCE_FILE_TYPE=.mxf \
	--SIDECAR_FILE_TYPE=.xml \
	--IGNORE_FILE_TYPE=.filepart \
	--COLLATERAL_FILE_TYPE=.srt,.xif \
	--NR_OF_COLLATERALS=2 \
	--RABBIT_MQ_HOST=localhost \
	--RABBIT_MQ_PORT=5672 \
	--RABBIT_MQ_VHOST=/dev \
	--RABBIT_MQ_SUCCESS_EXCHANGE=tempexchange \
	--RABBIT_MQ_SUCCESS_QUEUE=tempqueue \
	--RABBIT_MQ_ERROR_EXCHANGE=born.digital.errors \
	--RABBIT_MQ_ERROR_QUEUE=incomplete_packages \
	--RABBIT_MQ_TOPIC_TYPE=direct \
	--RABBIT_MQ_USER=guest \
	--RABBIT_MQ_PASSWORD=guest \
	--FTP_SERVER=localhost \
	--FTP_USERNAME=admin \
	--FTP_PASSWORD=admin \
	--CHECK_PACKAGE_INTERVAL=10000 \
	--CHECK_PACKAGE_AMOUNT=10 \
	--PROCESSING_FOLDER_NAME=processing \
	--INCOMPLETE_FOLDER_NAME=incomplete \
	--REFUSED_FOLDER_NAME=refused \
	--FOLDER_TO_WATCH=/home/ftphaven/watchfolder/