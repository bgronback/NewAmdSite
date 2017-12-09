package com.amdinstallation.web.config;

import org.apache.catalina.Context;
import org.apache.catalina.connector.Connector;
import org.apache.tomcat.util.descriptor.web.SecurityCollection;
import org.apache.tomcat.util.descriptor.web.SecurityConstraint;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.embedded.EmbeddedServletContainerFactory;
import org.springframework.boot.context.embedded.tomcat.TomcatEmbeddedServletContainerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

//@Configuration
public class TlsConfiguration {
	
	@Autowired
	private AmdProperties properties;
	
	@Bean
	public EmbeddedServletContainerFactory servletContainer() {
	  TomcatEmbeddedServletContainerFactory tomcat =
	      new TomcatEmbeddedServletContainerFactory() {

	        @Override
	        protected void postProcessContext(Context context) {
	          SecurityConstraint securityConstraint = new SecurityConstraint();
	          securityConstraint.setUserConstraint("CONFIDENTIAL");
	          SecurityCollection collection = new SecurityCollection();
	          collection.addPattern("/*");
	          securityConstraint.addCollection(collection);
	          context.addConstraint(securityConstraint);
	        }
	      };
	  tomcat.addAdditionalTomcatConnectors(createHttpConnector());
	  return tomcat;
	}

	@Value("${server.port}")
	private int serverPort;
	
	private Connector createHttpConnector() {
	  Connector connector =
	      new Connector("org.apache.coyote.http11.Http11NioProtocol");
	  connector.setScheme("http");
	  connector.setSecure(false);
	  connector.setPort(properties.getPort());
	  connector.setRedirectPort(serverPort);
	  return connector;
	}

}
