package com.fullstack.test;

import jakarta.persistence.*;

@Entity
public class Activity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String date;
    private String type;
    private float amount;
    private String notes;

    public Activity() {} // Required by JPA

    public Activity(String date, String type, float amount, String notes) {
        this.date = date;
        this.type = type;
        this.amount = amount;
        this.notes = notes;
    }

    public Long getId() {return id;}

    public String getDate() {return date;}
    public void setDate(String date) {this.date = date;}
    public String getType() {return type;}
    public void setType(String type) {this.type = type;}
    public float getAmount() {return amount;}
    public void setAmount(float amount) {this.amount = amount;}
    public String getNotes() {return notes;}
    public void setNotes(String notes) {this.notes = notes;}

}
