package com.event_management.event_management_system_backend.predictive;

import weka.classifiers.Classifier;
import weka.core.Attribute;
import weka.core.DenseInstance;
import weka.core.Instances;

import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.ArrayList;

@Service
public class PredictiveService {

    private Classifier model;
    private Instances datasetStructure;

    public PredictiveService() {
        try {
            InputStream modelStream = getClass().getClassLoader()
                    .getResourceAsStream("models/PAmodel.model");

            model = (Classifier) weka.core.SerializationHelper.read(modelStream);

            ArrayList<Attribute> attributes = new ArrayList<>();

            attributes.add(new Attribute("name", (ArrayList<String>) null));
            attributes.add(new Attribute("city", (ArrayList<String>) null));
            attributes.add(new Attribute("country", (ArrayList<String>) null));
            attributes.add(new Attribute("place", (ArrayList<String>) null));

            ArrayList<String> classValues = new ArrayList<>();
            classValues.add("baja");
            classValues.add("media");
            classValues.add("alta");

            attributes.add(new Attribute("attendance", classValues));

            datasetStructure = new Instances("EventPredict", attributes, 0);
            datasetStructure.setClassIndex(datasetStructure.numAttributes() - 1);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public String predict(String name, String city, String country, String place) {
        try {
            DenseInstance instance = new DenseInstance(datasetStructure.numAttributes());
            instance.setDataset(datasetStructure);

            instance.setValue(0, name);
            instance.setValue(1, city);
            instance.setValue(2, country);
            instance.setValue(3, place);

            double result = model.classifyInstance(instance);
            return datasetStructure.classAttribute().value((int) result);

        } catch (Exception e) {
            e.printStackTrace();
            return "error";
        }
    }
}
