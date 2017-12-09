package com.amdinstallation.web.model;

import java.io.Serializable;
import java.math.BigDecimal;

import org.springframework.data.annotation.Id;

public class Service implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	private String _id;
	private String serviceNumber;
	private String name;

	public Service() {

	}

	public String get_id() {
		return _id;
	}

	public void set_id(String _id) {
		this._id = _id;
	}

	public String getServiceNumber() {
		return serviceNumber;
	}

	public void setServiceNumber(String serviceNumber) {
		this.serviceNumber = serviceNumber;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public BigDecimal getPrice() {
		return price;
	}

	public void setPrice(BigDecimal price) {
		this.price = price;
	}

	@Override
	public String toString() {
		return "Service [serviceNumber=" + serviceNumber + ", name=" + name + ", price=" + price + "]";
	}

	private BigDecimal price;

}
