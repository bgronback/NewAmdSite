package com.amdinstallation.web.config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.MongoDbFactory;
import org.springframework.data.mongodb.config.AbstractMongoConfiguration;
import org.springframework.data.mongodb.core.SimpleMongoDbFactory;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import com.mongodb.Mongo;
import com.mongodb.MongoClient;
import com.mongodb.MongoCredential;
import com.mongodb.ServerAddress;

@Configuration
@EnableMongoRepositories(basePackages = "com.amdinstallation.web.repository")
public class MongoConfiguration extends AbstractMongoConfiguration {
	
	@Autowired
	private MongoProperties settings;
	
	@Bean
	public GridFsTemplate gridFsTemplate() throws Exception {
	    return new GridFsTemplate(prepareMongoFactory(), mappingMongoConverter());
	}
	
	@Bean
	protected MongoDbFactory prepareMongoFactory() throws Exception {
	    return new SimpleMongoDbFactory((MongoClient) mongo(), settings.getDatabase());
	}

	@Override
	protected String getDatabaseName() {
		return settings.getDatabase();
	}

	@Override
	public Mongo mongo() throws Exception {
		MongoCredential credential = MongoCredential.createScramSha1Credential(settings.getUser(), settings.getDatabase(), settings.getPassword().toCharArray());
	    ServerAddress serverAddress = new ServerAddress(settings.getHost(), settings.getPort());
	    return new MongoClient(serverAddress, Arrays.asList(credential)); 
	}

}
