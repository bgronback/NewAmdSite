package com.amdinstallation.web.controller;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.TimeZone;

import javax.mail.internet.MimeMessage;
import javax.mail.util.ByteArrayDataSource;

import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
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
	
	private static final int PART_COUNT_COL = 0;
	private static final int CUST_INFO_COL = 1;
	private static final int PART_NO_COL = 1;
	private static final int PART_NAME_COL = 3;
	private static final int PART_COST_COL = 7;
	private static final int CUST_DATA_COL = 3;
	private static final int AMD_INFO_COL = 5;
	private static final int LABOR_COST_COL = 9;
	private static final int CAR_INFO_COL = 7;
	private static final int CAR_DATA_COL = 9;
	
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
		sb.append("\n\nComments:\n\n");
		sb.append(estimate.getComments() == null ? "None" : estimate.getComments());
		sb.append("\n\n\n");
		
		String fileName = "estimate_" + estimate.getModel() + "_" + String.format("%1$tY%1$tm%1$td_%1$tH%1$tM%1$tS", new Date()) + ".xlsx";

		// Simple reply to customer, no pricing detail
		try {
			MimeMessage mail = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(mail, true);
			helper.setTo(properties.getEstimateEmail());
			helper.setCc(estimate.getEmail());
			helper.setBcc("richard.gronback@gmail.com");
			helper.setFrom(properties.getAdminEmail(), properties.getAdminEmailName());
			helper.setReplyTo(properties.getAdminEmail());
			helper.setSubject("Vehicle Estimate Submitted");
			helper.setText(sb.toString());
			mailSender.send(mail);
		} catch (Exception e) {
			LOGGER.error("Failed to send estimate email", e);
		}
		
		try {
			Workbook wb = createWorkbook(estimate);
			ByteArrayOutputStream bos = new ByteArrayOutputStream();
			wb.write(bos);
			bos.close();
			
			MimeMessage mail = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(mail, true);
			String[] bccs = {"richard.gronback@gmail.com", "billc@chpvideos.com", "bill@amdinstallation.com"};
			helper.setBcc(bccs);
			helper.setFrom(properties.getAdminEmail(), properties.getAdminEmailName());
			helper.setSubject("Vehicle Estimate");
			helper.setText(sb.toString() + getPricingDetail(estimate));
			helper.addAttachment(fileName, new ByteArrayDataSource(bos.toByteArray(), "application/vnd.ms-excel"));
			mailSender.send(mail);
		} catch (Exception e) {
			LOGGER.error("Failed to send estimate email", e);
		}

		return "OK";
	}
	
	private String getPricingDetail(Estimate estimate) {
		StringBuffer sb = new StringBuffer();
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

		for (Part item : estimate.getServices()) {
			sb.append(item.getPartNumber());
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
		sb.append("\n\n");
		return sb.toString();
	}

	private Workbook createWorkbook(Estimate estimate) {
		Workbook wb = new XSSFWorkbook();
		CreationHelper createHelper = wb.getCreationHelper();
		Sheet sheet = wb.createSheet("AMD Installation");
		sheet.setZoom(120);
		sheet.getPrintSetup().setLandscape(true);
		
		Font font = wb.createFont();
		font.setFontHeightInPoints((short)10);
		
		CellStyle style = wb.createCellStyle();
	    style.setFont(font);
		
		CellStyle dateStyle = wb.createCellStyle();
		dateStyle.setDataFormat(createHelper.createDataFormat().getFormat("mm/dd/yyyy"));
		dateStyle.setAlignment(HorizontalAlignment.LEFT);
		dateStyle.setFont(font);
		
		CellStyle left = wb.createCellStyle();
		left.setAlignment(HorizontalAlignment.LEFT);
		left.setFont(font);
		
		CellStyle right = wb.createCellStyle();
		right.setAlignment(HorizontalAlignment.RIGHT);
		right.setFont(font);
		
		CellStyle center = wb.createCellStyle();
		center.setAlignment(HorizontalAlignment.CENTER);
		center.setFont(font);
		
		CellStyle totals = wb.createCellStyle();
		totals.setAlignment(HorizontalAlignment.RIGHT);
		totals.setBorderTop(BorderStyle.HAIR);
		totals.setDataFormat((short)8); //8 = "($#,##0.00_);[Red]($#,##0.00)"
		totals.setFont(font);
		
		CellStyle currency = wb.createCellStyle();
		currency.setDataFormat((short)8); //8 = "($#,##0.00_);[Red]($#,##0.00)"
		currency.setFont(font);
		
		Font amdFont = wb.createFont();
		amdFont.setBold(true);
		amdFont.setFontHeightInPoints((short)16);
		
		CellStyle titleStyle = wb.createCellStyle();
		titleStyle.setAlignment(HorizontalAlignment.CENTER);
		titleStyle.setFont(amdFont);
		
		Row row = sheet.createRow(0);
		row.createCell(CUST_INFO_COL).setCellValue("Name");
		row.createCell(CUST_DATA_COL).setCellValue(estimate.getName());
		Cell titleCell = row.createCell(AMD_INFO_COL);
		titleCell.setCellValue("AMD Installation Center");
		titleCell.setCellStyle(titleStyle);
		row.createCell(CAR_INFO_COL).setCellValue("Date");
		Cell dateCell = row.createCell(CAR_DATA_COL);
		dateCell.setCellValue(Calendar.getInstance());
		dateCell.setCellStyle(dateStyle);
		
		row = sheet.createRow(1);
		row.createCell(CUST_INFO_COL).setCellValue("Address");
		Cell amdAddress = row.createCell(AMD_INFO_COL);
		amdAddress.setCellStyle(center);
		amdAddress.setCellValue("7314 Highway 115 East");
		row.createCell(CAR_INFO_COL).setCellValue("Prepared By");
		row.createCell(CAR_DATA_COL).setCellValue("Online");
		
		row = sheet.createRow(2);
		row.createCell(CUST_INFO_COL).setCellValue("City/State");
		Cell amdCityState = row.createCell(AMD_INFO_COL);
		amdCityState.setCellStyle(center);
		amdCityState.setCellValue("Cleveland, GA 30528");
		row.createCell(CAR_INFO_COL).setCellValue("Year");
		Cell yearCell = row.createCell(CAR_DATA_COL);
		yearCell.setCellStyle(left);
		yearCell.setCellValue(estimate.getYear());
		
		row = sheet.createRow(3);
		row.createCell(CUST_INFO_COL).setCellValue("Phone");
		row.createCell(CUST_DATA_COL).setCellValue(estimate.getPhone());
		Cell amdPhone = row.createCell(AMD_INFO_COL);
		amdPhone.setCellStyle(center);
		amdPhone.setCellValue("706-348-6653");
		row.createCell(CAR_INFO_COL).setCellValue("Make");
		row.createCell(CAR_DATA_COL).setCellValue(estimate.getMake().name());
		
		row = sheet.createRow(4);
		row.createCell(CUST_INFO_COL).setCellValue("Email");
		row.createCell(CUST_DATA_COL).setCellValue(estimate.getEmail());
		Cell amdLink = row.createCell(AMD_INFO_COL);
		amdLink.setCellStyle(center);
		amdLink.setCellValue("amdinstallation.com");
		row.createCell(CAR_INFO_COL).setCellValue("Model");
		row.createCell(CAR_DATA_COL).setCellValue(estimate.getModel().name());
		
		row = sheet.createRow(5);
		row.createCell(CAR_INFO_COL).setCellValue("VIN");
		row.createCell(CAR_DATA_COL).setCellValue(estimate.getVin());
		
		row = sheet.createRow(7);
		Cell numCell = row.createCell(PART_COUNT_COL);
		numCell.setCellStyle(right);
		numCell.setCellValue("#");
		row.createCell(PART_NO_COL).setCellValue("ITEM #");
		row.createCell(PART_NAME_COL).setCellValue("DESCRIPTION");
		Cell partCostCell = row.createCell(PART_COST_COL);
		partCostCell.setCellStyle(right);
		partCostCell.setCellValue("PART COST");
		Cell laborCostCell = row.createCell(CAR_DATA_COL);
		laborCostCell.setCellStyle(right);
		laborCostCell.setCellValue("LABOR COST");
		
		int partRow = 8;
		int partCount = 1;
		for (Part item : estimate.getParts()) {
			row = sheet.createRow(partRow++);
			row.createCell(PART_COUNT_COL).setCellValue(partCount++);
			row.createCell(PART_NO_COL).setCellValue(item.getPartNumber());
			row.createCell(PART_NAME_COL).setCellValue(item.getName());
			Cell price = row.createCell(PART_COST_COL);
			price.setCellStyle(currency);
			price.setCellValue(item.getPrice() == null ? 0d : item.getPrice().doubleValue());
			Cell labor = row.createCell(LABOR_COST_COL);
			labor.setCellStyle(currency);
			labor.setCellValue(item.getLabor() == null ? 0d : item.getLabor().doubleValue());
		}
		for (Part item : estimate.getServices()) {
			row = sheet.createRow(partRow++);
			row.createCell(PART_COUNT_COL).setCellValue(partCount++);
			row.createCell(PART_NO_COL).setCellValue(item.getPartNumber());
			row.createCell(PART_NAME_COL).setCellValue(item.getName());
			Cell price = row.createCell(LABOR_COST_COL);
			price.setCellStyle(currency);
			price.setCellValue(item == null ? 0d : item.getPrice().doubleValue());
		}
		
		row = sheet.createRow(partRow++);
		Cell additional1 = row.createCell(AMD_INFO_COL);
		additional1.setCellValue("Deposits");
		additional1.setCellStyle(right);
		
		row = sheet.createRow(partRow++);
		row = sheet.createRow(partRow++);
		row = sheet.createRow(partRow++);
		
		row = sheet.createRow(partRow);
		Cell subTotals = row.createCell(AMD_INFO_COL);
		subTotals.setCellValue("Subtotal");
		subTotals.setCellStyle(right);
		Cell partTotal = row.createCell(PART_COST_COL);
		partTotal.setCellStyle(totals);
		partTotal.setCellFormula("SUM(H9:H" + partRow + ")");
		Cell laborTotal = row.createCell(LABOR_COST_COL);
		laborTotal.setCellStyle(totals);
		laborTotal.setCellFormula("SUM(J9:J" + partRow + ")");
		
		row = sheet.createRow(partRow + 2);
		Cell tax = row.createCell(AMD_INFO_COL);
		tax.setCellStyle(right);
		tax.setCellValue("Tax");
		Cell laborCost = row.createCell(PART_COST_COL);
		laborCost.setCellFormula("H" + (partRow + 1) + "*0.07"); // FIXME obtain tax rate
		laborCost.setCellStyle(currency);
		
		row = sheet.createRow(partRow + 3);
		Cell total = row.createCell(PART_COST_COL);
		total.setCellStyle(right);
		total.setCellValue("Total");
		Cell totalCost = row.createCell(LABOR_COST_COL);
		totalCost.setCellStyle(currency);
		totalCost.setCellFormula("SUM(H" + (partRow + 1) + ":J" + (partRow + 1) + ")");
		
		// set column widths last
		sheet.setColumnWidth(PART_COUNT_COL, 5 * 256);
		sheet.setColumnWidth(CUST_INFO_COL, 15 * 256);
		sheet.setColumnWidth(2, 1 * 256);
		sheet.setColumnWidth(CUST_DATA_COL, 20 * 256);
		sheet.setColumnWidth(4, 1 * 256);
		sheet.setColumnWidth(PART_COST_COL, 25 * 256);
		sheet.setColumnWidth(6, 1 * 256);
		sheet.setColumnWidth(AMD_INFO_COL, 30 * 256);
		sheet.setColumnWidth(8, 1 * 256);
		sheet.setColumnWidth(CAR_INFO_COL, 15 * 256);
		sheet.setColumnWidth(10, 1 * 256);
		sheet.setColumnWidth(CAR_DATA_COL, 20 * 256);
		
		// empty line above part list
		sheet.addMergedRegion(new CellRangeAddress(
	            6, //first row (0-based)
	            6, //last row  (0-based)
	            0, //first column (0-based)
	            9  //last column  (0-based)
	    ));
		
		// description fields
		int limit = 8 + estimate.getParts().size() + estimate.getServices().size();
		for (int i = 8; i < limit; i ++) {
			sheet.addMergedRegion(new CellRangeAddress(
		            i, //first row (0-based)
		            i, //last row  (0-based)
		            CUST_DATA_COL, //first column (0-based)
		            AMD_INFO_COL  //last column  (0-based)
		    ));
		}
		
		for (int j = 1; j < sheet.getPhysicalNumberOfRows(); j++) {
	        Row r = sheet.getRow(j);
	        if (r != null) {
	            for (int i = 0; i < r.getPhysicalNumberOfCells(); i++) {
	                Cell cell = r.getCell(i);
	                if (cell != null) {
	                	cell.getCellStyle().setFont(font);
	                }
	            }
	        }
	    }
		
		return wb;
	}

}
