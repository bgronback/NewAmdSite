package com.amdinstallation.web.controller;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import com.mongodb.gridfs.GridFSDBFile;

@RestController
public class FileController {
    private static final Logger logger = LoggerFactory.getLogger(FileController.class);
    
    @Autowired
    GridFsTemplate gridFsTemplate;
    
    public class FileDescriptor {
    	public FileDescriptor() {}
    	public FileDescriptor(String name, String id, String date) {
    		this.name = name;
    		this.id = id;
    		this.date = date;
    	}
    	private String name;
    	private String id;
    	private String date;
    	
		public String getName() {
			return name;
		}
		public void setName(String name) {
			this.name = name;
		}
		public String getId() {
			return id;
		}
		public void setId(String id) {
			this.id = id;
		}
		public String getDate() {
			return date;
		}
		public void setDate(String date) {
			this.date = date;
		}
    }
    
	@GetMapping(value="/api/v1/files/{id}", produces = "video/mp4")
    @ResponseBody
    public StreamingResponseBody serveFile(@PathVariable String id) throws NotFoundException {
    	GridFSDBFile gridFsdbFile = gridFsTemplate.findOne(new Query(Criteria.where(id.contains("-") ? "metadata.uuid" : "_id").is(id)));
    	if (gridFsdbFile != null) {
    		return (os) -> {
    			readAndWrite(gridFsdbFile.getInputStream(), os);
    		};
    	} else {
    		throw new NotFoundException();
    	}
    }
	
	private void readAndWrite(final InputStream is, OutputStream os)
			throws IOException {
		byte[] data = new byte[2048];
		int read = 0;
		while ((read = is.read(data)) > 0) {
			os.write(data, 0, read);
		}
		os.flush();
	}
	
    @RequestMapping(value = "/api/v1/files", method = RequestMethod.POST, produces = "text/plain")
    @ResponseBody
    public String uploadFileHandler(HttpServletRequest request, @RequestParam("file") MultipartFile file) throws IOException {
        if (!file.isEmpty()) {
            InputStream in = null;
            try {
                in = file.getInputStream();
                DBObject metaData = new BasicDBObject();
                metaData.put("type", "video");
                String filename = file.getOriginalFilename();
                String id = gridFsTemplate.store(in, file.getOriginalFilename(), file.getContentType(), metaData).getId().toString();
                logger.error("Saved file: " + filename + " as id: " + id);
                in.close();
                return "OK";
            } catch (Exception e) {
                return "ERROR: " + e.getMessage();
            } finally {
                if (in != null) {
                    in.close();
                    in = null;
                }
            }
        } else {
            return "File is empty";
        }
    }
    
	@SuppressWarnings("rawtypes")
	@ExceptionHandler(StorageFileNotFoundException.class)
    public ResponseEntity handleStorageFileNotFound(StorageFileNotFoundException exc) {
        return ResponseEntity.notFound().build();
    }
    
    class StorageFileNotFoundException extends RuntimeException {

		private static final long serialVersionUID = 1L;
    	
		public StorageFileNotFoundException(String message) {
			super(message);
		}
    }
}