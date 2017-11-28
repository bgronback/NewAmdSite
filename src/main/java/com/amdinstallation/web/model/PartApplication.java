package com.amdinstallation.web.model;

import java.io.Serializable;

public class PartApplication implements Serializable {

	private static final long serialVersionUID = 1L;
	private Integer from;
	private Integer to;
	private Make make;
	private Model model;
	
	public PartApplication() {
		
	}
	
	public Integer getFrom() {
		return from;
	}
	public void setFrom(Integer from) {
		this.from = from;
	}
	public Integer getTo() {
		return to;
	}
	public void setTo(Integer to) {
		this.to = to;
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
}
