package com.amdinstallation.web.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.amdinstallation.web.model.Make;
import com.amdinstallation.web.model.Model;
import com.amdinstallation.web.model.Part;

public interface PartsRepository extends MongoRepository<Part, String> {
	List<Part> findByApplicationsMakeAndApplicationsModelOrderByName(Make make, Model model);

	List<Part> findByPartNumberContainingIgnoreCase(String name);
	
	List<Part> findByPrice(BigDecimal price);

	Part findByPartNumber(String partNumber);
}
