package com.amdinstallation.web.model;

import java.util.List;

public class Estimate {
	
	private String name;
	private String email;
	private String phone;
	private Make make;
	private Model model;
	private String vin;
	private String comments;
	private Integer year;
	private List<Part> parts;
	private List<Part> services;
	
	public Estimate() {
		
	}
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public List<Part> getParts() {
		return parts;
	}
	public void setParts(List<Part> parts) {
		this.parts = parts;
	}

	public Make getMake() {
		return make;
	}

	public void setMake(Make make) {
		this.make = make;
	}

	public Model getModel() {
		return model;
	}

	public void setModel(Model model) {
		this.model = model;
	}

	public Integer getYear() {
		return year;
	}

	public void setYear(Integer year) {
		this.year = year;
	}

	public String getVin() {
		return vin;
	}

	public void setVin(String vin) {
		this.vin = vin;
	}

	public String getComments() {
		return comments;
	}

	public void setComments(String comments) {
		this.comments = comments;
	}

	public List<Part> getServices() {
		return services;
	}

	public void setServices(List<Part> services) {
		this.services = services;
	}

	@Override
	public String toString() {
		return "Estimate [name=" + name + ", email=" + email + ", phone=" + phone + ", parts=" + parts + "]";
	}

}
