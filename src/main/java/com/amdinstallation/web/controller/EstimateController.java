package com.amdinstallation.web.controller;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;

import javax.mail.internet.MimeMessage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.amdinstallation.web.model.Estimate;
import com.amdinstallation.web.model.Part;

@RestController
@RequestMapping("/api/v1/estimates")
public class EstimateController {
	
	public static Logger LOGGER = LoggerFactory.getLogger(EstimateController.class);
	
	@Autowired
	private JavaMailSender mailSender;
	
	private static SimpleDateFormat sdf = new SimpleDateFormat();
	static {
		sdf.setTimeZone(TimeZone.getTimeZone("America/New_York"));
	}
	
	@PostMapping
	public @ResponseStatus(HttpStatus.OK) String submit(@RequestBody Estimate estimate) {
		LOGGER.debug("Received estimate: " + estimate);
		
		StringBuilder sb = new StringBuilder();
		sb.append("Estimate requested by ");
		sb.append(estimate.getName());
		sb.append(" on ");
		sb.append(sdf.format(new Date()));
		sb.append(":\n\nVehicle: ");
		sb.append(estimate.getYear());
		sb.append(" ");
		sb.append(estimate.getMake().name());
		sb.append(" ");
		sb.append(estimate.getModel().name());
		if (estimate.getVin() != null) {
			sb.append(" (");
			sb.append(estimate.getVin());
			sb.append(")");
		}
		sb.append("\n\nemail: ");
		sb.append(estimate.getEmail());
		sb.append("\nphone: ");
		sb.append(estimate.getPhone() == null ? "" : estimate.getPhone());
		sb.append("\n\nItems:\n\n");
		sb.append("Part Num\t\t\tPrice\tLabor\t\t\tName\n");
		List<Part> items = estimate.getParts();
		Collections.sort(items, new Comparator<Part>() {

			@Override
			public int compare(Part o1, Part o2) {
				return o1.getPartNumber().compareTo(o2.getPartNumber());
			}
		});
		
		BigDecimal partsTotal = BigDecimal.ZERO;
		BigDecimal laborTotal = BigDecimal.ZERO;

		for (Part item : items) {
			sb.append(item.getPartNumber());
			sb.append("\t");
			if (item.getPartNumber().length() < 9) {
				sb.append("\t\t");
			} else if (item.getPartNumber().length() < 12) {
				sb.append("\t");
			}
			partsTotal = partsTotal.add(item.getPrice() == null ? BigDecimal.ZERO : item.getPrice());
			laborTotal = laborTotal.add(item.getLabor() == null ? BigDecimal.ZERO : item.getLabor());
			sb.append(NumberFormat.getCurrencyInstance().format(item.getPrice() == null ? BigDecimal.ZERO : item.getPrice()));
			sb.append("\t");
			sb.append(NumberFormat.getCurrencyInstance().format(item.getLabor() == null ? BigDecimal.ZERO : item.getLabor()));
			if (item.getPrice() != null && item.getPrice().compareTo(new BigDecimal(1000)) < 0) {
				sb.append("\t");
			}
			sb.append("\t\t");
			sb.append(item.getName());
			sb.append("\n");
		}
		BigDecimal materials = laborTotal.multiply(new BigDecimal(0.10));
		BigDecimal tax = partsTotal.multiply(new BigDecimal(0.04));
		sb.append("\n\nParts: ");
		sb.append(NumberFormat.getCurrencyInstance().format(partsTotal));
		sb.append("\nLabor: ");
		sb.append(NumberFormat.getCurrencyInstance().format(laborTotal));
		sb.append("\nMaterials: ");
		sb.append(NumberFormat.getCurrencyInstance().format(materials));
		sb.append("\nSales Tax: ");
		sb.append(NumberFormat.getCurrencyInstance().format(tax));
		sb.append("\n\nTotal: ");
		sb.append(NumberFormat.getCurrencyInstance().format(partsTotal.add(laborTotal).add(materials).add(tax)));

		sb.append("\n\nComments:\n\n");
		sb.append(estimate.getComments() == null ? "None" : estimate.getComments());
		
		try {
	    	MimeMessage mail = mailSender.createMimeMessage();
	        MimeMessageHelper helper = new MimeMessageHelper(mail, true);
//	        helper.setTo("estimate@amdinstallation.com");
	        helper.setTo("richard.gronback@gmail.com");
	        helper.setCc(estimate.getEmail());
	        helper.setBcc("richard.gronback@gmail.com");
	        helper.setFrom("admin@amdinstallation.com", "AMD Installation Center");
	        helper.setReplyTo("admin@amdinstallation.com");
	        helper.setSubject("Vehicle Estimate");
	        helper.setText(sb.toString());
	        mailSender.send(mail);
	    } catch (Exception e) {
	        LOGGER.error("Failed to send estimate email", e);
	    }
		
		return "OK";
	}

}
