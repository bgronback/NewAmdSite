package com.amdinstallation.web;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.io.Writer;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.amdinstallation.web.model.Make;
import com.amdinstallation.web.model.Model;
import com.amdinstallation.web.model.Part;
import com.amdinstallation.web.model.PartApplication;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class PricingTransformer {
	
	public static void main(String[] args) {
		Map<String, BigDecimal> labor = loadLabor();
		System.out.println("Loaded labor for part count: " + labor.size());
		
		try {
			FileInputStream excelFile = new FileInputStream(new File("/Users/rgronback/git/NewAmdSite/src/main/resources/pricing.xlsx"));
			Workbook workbook = new XSSFWorkbook(excelFile);
			Sheet datatypeSheet = workbook.getSheetAt(0);
			Iterator<Row> iterator = datatypeSheet.iterator();
			List<Part> parts = new ArrayList<Part>();
			boolean first = true;
			while (iterator.hasNext()) {
				if (first) {
					first = false;
					iterator.next();
				}
				Part part = new Part();
				Row row = iterator.next();
				part.setBrand(row.getCell(0).getStringCellValue());
				part.setPartNumber(row.getCell(1).getStringCellValue().trim());
				part.setLabor(labor.get(part.getPartNumber()));
				part.setName(row.getCell(2).getStringCellValue());
				part.setPrice(new BigDecimal(row.getCell(3).getNumericCellValue()).setScale(2, BigDecimal.ROUND_UP));
				part.setDescription(row.getCell(6) == null ? null : row.getCell(6).getStringCellValue());
				part.setImage(row.getCell(15).getStringCellValue());
//				part.setInfo(row.getCell(16).getStringCellValue());

				String application = row.getCell(7).getStringCellValue();
				part.setApplications(parseApplications(application));
				
				parts.add(part);
			}
			workbook.close();
			System.out.println("Parsed parts: " + parts.size());
			try (Writer writer = new FileWriter("/Users/rgronback/git/NewAmdSite/src/main/resources/pricing.json")) {
				Gson gson = new GsonBuilder().setPrettyPrinting().create();
			    gson.toJson(parts, writer);
			}
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	private static List<PartApplication> parseApplications(String application) {
		List<PartApplication> applications = new ArrayList<PartApplication>();
		String[] splits = application.split("\n");
		for (String split : splits) {
			PartApplication app = new PartApplication();
			String[] innerSplits = split.split(" ");
			app.setFrom(Integer.valueOf(innerSplits[0].trim()));
			app.setTo(Integer.valueOf(innerSplits[2].trim()));
			app.setMake(Make.valueOf(innerSplits[3].trim().toUpperCase()));
			String model = innerSplits[4].trim().toUpperCase();
			if (model.equals("330") || model.equals("440")) {
				continue;
			}
			if (model.equals("ROAD")) {
				app.setModel(Model.ROAD_RUNNER);
			} else if (model.equals("SUPER")) {
				app.setModel(Model.SUPERBIRD);
			} else if (model.equals("442")) {
				app.setModel(Model.O442);
			} else if (model.equals("GRAND")) {
				app.setModel(Model.GRAND_PRIX);
			} else if (model.equals("BEL")) {
				app.setModel(Model.BEL_AIR);
			} else if (model.equals("CHEVY")) {
				app.setModel(Model.CHEVY_II);
			} else if (model.equals("EL")) {
				app.setModel(Model.EL_CAMINO);
			} else if (model.equals("TRANS")) {
				app.setModel(Model.TRANS_AM);
			} else if (model.equals("MONTE")) {
				app.setModel(Model.MONTE_CARLO);
			} else {
				app.setModel(Model.valueOf(model));
			}
			applications.add(app);
		}
		return applications;
	}

	private static Map<String, BigDecimal> loadLabor() {
		Map<String, BigDecimal> result = new HashMap<String, BigDecimal>();
		try {
			FileInputStream excelFile = new FileInputStream(new File("/Users/rgronback/git/NewAmdSite/src/main/resources/labor.xlsx"));
			Workbook workbook = new XSSFWorkbook(excelFile);
			Sheet datatypeSheet = workbook.getSheetAt(0);
			Iterator<Row> iterator = datatypeSheet.iterator();

			boolean first = true;
			while (iterator.hasNext()) {
				if (first) {
					first = false;
					iterator.next();
				}
				Row currentRow = iterator.next();
				Iterator<Cell> cellIterator = currentRow.iterator();
				Cell part = cellIterator.next();
				Cell labor = cellIterator.next();
				BigDecimal laborPrice = BigDecimal.ZERO;
				if (labor != null) {
					// add 3%
					laborPrice = new BigDecimal(labor.getNumericCellValue()/* * 1.03*/);
				}
				laborPrice = laborPrice.setScale(2, BigDecimal.ROUND_UP);
				result.put(part.getStringCellValue().trim(), laborPrice);
			}
			workbook.close();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return result;
	}

}
