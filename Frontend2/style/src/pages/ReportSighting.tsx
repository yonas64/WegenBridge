import Navbar from "../components/Navbar";
import React, { useState, ChangeEvent } from "react";
import { Link } from "react-router-dom";

export default function ReportMissingPerson() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    lastSeenLocation: "",
    lastSeenDate: "",
    lastSeenTime: "",
    description: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    relationship: "",
    photo: null
  });

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    console.log("Report submitted:", formData);
    // Add your form submission logic here
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target;
    const name = target.name;
    // Narrow to file inputs which have `files`, otherwise use the value
    if ("files" in target && target.files) {
      setFormData(prev => ({
        ...prev,
   //     [name]: target.files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: target.value
      }));
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Navbar />
      
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.75rem' }}>
            Report Missing Person
          </h1>
          <p style={{ color: '#4b5563' }}>
            Help us reunite families by providing accurate information
          </p>
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '1rem', 
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          border: '1px solid #f3f4f6',
          padding: '1.5rem'
        }}>
          {/* Form Header */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '1.5rem', 
            padding: '1rem',
            background: 'linear-gradient(to right, #eff6ff, #f5f3ff)',
            borderRadius: '0.75rem'
          }}>
            <div style={{ 
              width: '1.5rem', 
              height: '1.5rem', 
              color: '#2563eb',
              marginRight: '0.75rem'
            }}>
              ⚠️
            </div>
            <div>
              <h2 style={{ fontWeight: 'bold', color: '#1f2937' }}>Important Information</h2>
              <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>All information is kept confidential and secure</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Personal Information Section */}
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                Personal Information
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: '#f9fafb',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.75rem',
                      outline: 'none',
                      transition: 'all 0.2s'
                    }}
                    placeholder="Enter full name"
                    required
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Age *
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: '#f9fafb',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.75rem',
                      outline: 'none'
                    }}
                    placeholder="Enter age"
                    min="0"
                    max="120"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: '#f9fafb',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.75rem',
                      outline: 'none'
                    }}
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Last Seen Date *
                  </label>
                  <input
                    type="date"
                    name="lastSeenDate"
                    value={formData.lastSeenDate}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: '#f9fafb',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.75rem',
                      outline: 'none'
                    }}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Last Seen Information */}
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                Last Seen Information
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Last Seen Location *
                  </label>
                  <input
                    type="text"
                    name="lastSeenLocation"
                    value={formData.lastSeenLocation}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: '#f9fafb',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.75rem',
                      outline: 'none'
                    }}
                    placeholder="Address, landmark, city"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Last Seen Time (Approximate)
                  </label>
                  <input
                    type="time"
                    name="lastSeenTime"
                    value={formData.lastSeenTime}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: '#f9fafb',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.75rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                Physical Description
              </h3>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    backgroundColor: '#f9fafb',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.75rem',
                    outline: 'none',
                    minHeight: '120px',
                    resize: 'vertical'
                  }}
                  placeholder="Describe clothing, physical features, distinguishing marks, etc."
                  required
                />
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                Your Contact Information
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: '#f9fafb',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.75rem',
                      outline: 'none'
                    }}
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Relationship to Missing Person *
                  </label>
                  <input
                    type="text"
                    name="relationship"
                    value={formData.relationship}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: '#f9fafb',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.75rem',
                      outline: 'none'
                    }}
                    placeholder="Family, friend, etc."
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: '#f9fafb',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.75rem',
                      outline: 'none'
                    }}
                    placeholder="+234 800 000 0000"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: '#f9fafb',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.75rem',
                      outline: 'none'
                    }}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                Photo
              </h3>
              
              <div style={{ 
                border: '2px dashed #d1d5db', 
                borderRadius: '1rem', 
                padding: '1.5rem', 
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'border-color 0.2s'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📷</div>
                <p style={{ color: '#4b5563', marginBottom: '0.5rem' }}>
                  {formData.photo ? formData.photo: "Upload a clear photo of the missing person"}
                </p>
                <label style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backgroundColor: '#f3f4f6', 
                  color: '#374151',
                  padding: '0.5rem 1rem', 
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}>
                  <span style={{ marginRight: '0.5rem' }}>📁</span>
                  Choose File
                  <input
                    type="file"
                    name="photo"
                    onChange={handleChange}
                    style={{ display: 'none' }}
                    accept="image/*"
                  />
                </label>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>Max file size: 5MB</p>
              </div>
            </div>

            {/* Form Actions */}
            <div style={{ paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    background: 'linear-gradient(to right, #2563eb, #7c3aed)',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.75rem',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                >
                  Submit Report
                </button>
                <Link
                  to="/"
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    border: '1px solid #d1d5db',
                    color: '#374151',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.75rem',
                    fontWeight: '600',
                    textDecoration: 'none',
                    transition: 'background-color 0.2s'
                  }}
                >
                  Cancel
                </Link>
              </div>
            </div>

            {/* Privacy Notice */}
            <div style={{ 
              padding: '1rem',
              background: 'linear-gradient(to right, #f0fdf4, #ecfdf5)',
              borderRadius: '0.75rem',
              border: '1px solid #d1fae5'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div style={{ 
                  width: '1.25rem', 
                  height: '1.25rem', 
                  color: '#10b981',
                  marginRight: '0.75rem',
                  marginTop: '0.125rem'
                }}>
                  🔒
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#374151' }}>
                    Your information is secure and confidential. By submitting this report, you agree to our privacy policy.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}