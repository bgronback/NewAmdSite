package com.amdinstallation.web.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.amdinstallation.web.model.Make;
import com.amdinstallation.web.model.Model;
import com.amdinstallation.web.model.Part;

public interface PartsRepository extends MongoRepository<Part, String> {
	List<Part> findByApplicationsMakeAndApplicationsModelOrderByName(Make make, Model model);

	List<Part> findByNameContainingIgnoreCase(String name);

	Part findByPartNumber(String partNumber);
}
