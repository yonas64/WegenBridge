import Navbar from "../components/Navbar";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  User, 
  Calendar, 
  MapPin, 
  Camera, 
  FileText, 
  AlertCircle,
  Upload,
  X,
  Shield,
  Phone,
  Mail
} from "lucide-react";

export default function ReportMissingPerson() {
  type ReportForm = {
    name: string;
    age: string;
    gender: string;
    lastSeenLocation: string;
    lastSeenDate: string;
    lastSeenTime: string;
    description: string;
    contactName: string;
    contactPhone: string;
    contactEmail: string;
    relationship: string;
    photo: File | null;
  };

  const [formData, setFormData] = useState<ReportForm>({
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
    photo: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const key = target.name as keyof ReportForm;

    // handle file inputs
    if ('files' in target && (target as HTMLInputElement).files && (target as HTMLInputElement).files!.length > 0) {
      const file = (target as HTMLInputElement).files![0];
      setFormData(prev => ({ ...prev, [key]: file } as unknown as ReportForm));
      return;
    }

    const value = (target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value;
    setFormData(prev => ({ ...prev, [key]: value } as unknown as ReportForm));
  };

 const handleSubmit = async (e: React.FormEvent | React.MouseEvent) => {
  e.preventDefault();

  const form = new FormData();

  Object.entries(formData).forEach(([key, value]) => {
    if (value !== null) {
      form.append(key, value as any);
    }
  });

  try {
    const res = await fetch("http://localhost:3000/api/missing-persons", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: form,
    });

    const data = await res.json();
    console.log("Success:", data);
  } catch (err) {
    console.error("Submit failed", err);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Report Missing Person</h1>
          <p className="text-gray-600">
            Help us reunite families by providing accurate information
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          {/* Form Header */}
          <div className="flex items-center mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
            <AlertCircle className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <h2 className="font-bold text-gray-900">Important Information</h2>
              <p className="text-sm text-gray-600">All information is kept confidential and secure</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* Personal Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age *
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter age"
                    min="0"
                    max="120"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    required
                  >
                      <option value="">Select gender</option> 
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Seen Date *
                  </label>
                  <input
                    type="date"
                    name="lastSeenDate"
                    value={formData.lastSeenDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Last Seen Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-red-600" />
                Last Seen Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Seen Location *
                  </label>
                  <input
                    type="text"
                    name="lastSeenLocation"
                    value={formData.lastSeenLocation}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Address, landmark, city"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Seen Time (Approximate)
                  </label>
                  <input
                    type="time"
                    name="lastSeenTime"
                    value={formData.lastSeenTime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-amber-600" />
                Physical Description
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all min-h-[120px]"
                  placeholder="Describe clothing, physical features, distinguishing marks, etc."
                  required
                />
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Phone className="h-5 w-5 mr-2 text-green-600" />
                Your Contact Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Relationship to Missing Person *
                  </label>
                  <input
                    type="text"
                    name="relationship"
                    value={formData.relationship}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Family, friend, etc."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="+234 800 000 0000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Camera className="h-5 w-5 mr-2 text-purple-600" />
                Photo
              </h3>
              
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-400 transition-colors">
                <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">
                  {formData.photo ? formData.photo.name : "Upload a clear photo of the missing person"}
                </p>
                <label className="inline-flex items-center justify-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                  <Camera className="h-4 w-4 mr-2" />
                  Choose File
                  <input
                    type="file"
                    name="photo"
                    onChange={handleChange}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">Max file size: 5MB</p>
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Submit Report
                </button>
                <Link
                  to="/"
                  className="flex-1 text-center border border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </Link>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
              <div className="flex items-start">
                <Shield className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-700">
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