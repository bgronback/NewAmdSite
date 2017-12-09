package com.amdinstallation.web.controller;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Locale;
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

import com.amdinstallation.web.config.AmdProperties;
import com.amdinstallation.web.model.Estimate;
import com.amdinstallation.web.model.Part;
import com.amdinstallation.web.model.Service;

@RestController
@RequestMapping("/api/v1/estimates")
public class EstimateController {
	
	public static Logger LOGGER = LoggerFactory.getLogger(EstimateController.class);
	
	@Autowired
	private AmdProperties properties;
	
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
		sb.append("Part Number, Price, Labor, Name\n");
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
			sb.append(", ");
			partsTotal = partsTotal.add(item.getPrice() == null ? BigDecimal.ZERO : item.getPrice());
			laborTotal = laborTotal.add(item.getLabor() == null ? BigDecimal.ZERO : item.getLabor());
			sb.append(NumberFormat.getCurrencyInstance(Locale.US).format(item.getPrice() == null ? BigDecimal.ZERO : item.getPrice()));
			sb.append(", ");
			sb.append(NumberFormat.getCurrencyInstance(Locale.US).format(item.getLabor() == null ? BigDecimal.ZERO : item.getLabor()));
			sb.append(", ");
			sb.append(item.getName());
			sb.append("\n");
		}
		BigDecimal materials = laborTotal.multiply(new BigDecimal(0.10));
		BigDecimal tax = partsTotal.multiply(new BigDecimal(0.04));
		sb.append("\n\nParts: ");
		sb.append(NumberFormat.getCurrencyInstance(Locale.US).format(partsTotal));
		sb.append("\nLabor: ");
		sb.append(NumberFormat.getCurrencyInstance(Locale.US).format(laborTotal));
		sb.append("\nMaterials: ");
		sb.append(NumberFormat.getCurrencyInstance(Locale.US).format(materials));
		
		BigDecimal servicesTotal = BigDecimal.ZERO;

		for (Service item : estimate.getServices()) {
			sb.append(item.getServiceNumber());
			sb.append(", ");
			servicesTotal = servicesTotal.add(item.getPrice() == null ? BigDecimal.ZERO : item.getPrice());
			sb.append(NumberFormat.getCurrencyInstance(Locale.US).format(item.getPrice() == null ? BigDecimal.ZERO : item.getPrice()));
			sb.append(", ");
			sb.append(item.getName());
			sb.append("\n");
		}
		sb.append("\n\nServices: ");
		sb.append(NumberFormat.getCurrencyInstance(Locale.US).format(servicesTotal));
		
		sb.append("\nSales Tax: ");
		sb.append(NumberFormat.getCurrencyInstance(Locale.US).format(tax));
		sb.append("\n\nTotal: ");
		sb.append(NumberFormat.getCurrencyInstance(Locale.US).format(partsTotal.add(laborTotal).add(materials).add(servicesTotal).add(tax)));

		sb.append("\n\nComments:\n\n");
		sb.append(estimate.getComments() == null ? "None" : estimate.getComments());
		
		try {
	    	MimeMessage mail = mailSender.createMimeMessage();
	        MimeMessageHelper helper = new MimeMessageHelper(mail, true);
	        helper.setTo(properties.getEstimateEmail());
	        helper.setCc(estimate.getEmail());
	        helper.setBcc("richard.gronback@gmail.com");
	        helper.setFrom(properties.getAdminEmail(), properties.getAdminEmailName());
	        helper.setReplyTo(properties.getAdminEmail());
	        helper.setSubject("Vehicle Estimate");
	        helper.setText(sb.toString());
	        mailSender.send(mail);
	    } catch (Exception e) {
	        LOGGER.error("Failed to send estimate email", e);
	    }
		
		return "OK";
	}

}
