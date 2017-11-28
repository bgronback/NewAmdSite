package com.amdinstallation.web.model;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.annotation.Id;

public class Part implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	@Id
	private String _id;
	private String brand;
	private String partNumber;
	private String name;
	private String description;
	private BigDecimal price;
	private BigDecimal labor;
	private String image;
	private List<PartApplication> applications;
	
	public Part() {
		
	}
	
	public String get_id() {
		return _id;
	}
	public void set_id(String _id) {
		this._id = _id;
	}
	public String getBrand() {
		return brand;
	}
	public void setBrand(String brand) {
		this.brand = brand;
	}
	public String getPartNumber() {
		return partNumber;
	}
	public void setPartNumber(String partNumber) {
		this.partNumber = partNumber;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public BigDecimal getPrice() {
		return price;
	}
	public void setPrice(BigDecimal price) {
		this.price = price;
	}
	public BigDecimal getLabor() {
		return labor;
	}
	public void setLabor(BigDecimal labor) {
		this.labor = labor;
	}
	public String getImage() {
		return image;
	}
	public void setImage(String image) {
		this.image = image;
	}
	public List<PartApplication> getApplications() {
		return applications;
	}
	public void setApplications(List<PartApplication> applications) {
		this.applications = applications;
	}
	
}
