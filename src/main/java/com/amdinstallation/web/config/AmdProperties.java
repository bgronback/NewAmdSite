package com.amdinstallation.web.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix="amd")
public class AmdProperties {

	private Integer port;
	private String adminEmail;
	private String adminEmailName;
	private String estimateEmail;
	
	public String getEstimateEmail() {
		return estimateEmail;
	}
	public void setEstimateEmail(String estimateEmail) {
		this.estimateEmail = estimateEmail;
	}
	public String getAdminEmailName() {
		return adminEmailName;
	}
	public void setAdminEmailName(String adminEmailName) {
		this.adminEmailName = adminEmailName;
	}
	public Integer getPort() {
		return port;
	}
	public void setPort(Integer port) {
		this.port = port;
	}
	public String getAdminEmail() {
		return adminEmail;
	}
	public void setAdminEmail(String adminEmail) {
		this.adminEmail = adminEmail;
	}
}
