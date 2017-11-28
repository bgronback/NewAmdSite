package com.amdinstallation.web.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.amdinstallation.web.model.Make;
import com.amdinstallation.web.model.Model;
import com.amdinstallation.web.model.Part;
import com.amdinstallation.web.repository.PartsRepository;

@RestController
@RequestMapping("/api/v1/parts")
public class PartsController {
	
	public static Logger LOGGER = LoggerFactory.getLogger(PartsController.class);
	
	@Autowired
	private PartsRepository repository;

	@RequestMapping("/{make}/{model}/{year}")
	public ResponseEntity<List<Part>> partsForCar(@PathVariable Make make, @PathVariable Model model, @PathVariable Integer year) {
		LOGGER.debug("Returning parts for: " + make + " " + model + " " + year);
		List<Part> list = repository.findByApplicationsMakeAndApplicationsModelOrderByName(make, model);
		// filter by year (TODO use Mongo query)
		List<Part> byYear = list.stream()
				.filter(part -> part.getApplications().stream()
						.filter(app -> year >= app.getFrom() && year <= app.getTo()).findAny().isPresent())
				.collect(Collectors.toList());
		return new ResponseEntity<List<Part>>(byYear, HttpStatus.OK);
	}
	
	@PostMapping
	public @ResponseStatus(HttpStatus.OK) String loadParts(@RequestBody List<Part> parts) {
		LOGGER.error("Received parts list: " + parts.size());
		repository.save(parts);
		return "OK";
	}
}