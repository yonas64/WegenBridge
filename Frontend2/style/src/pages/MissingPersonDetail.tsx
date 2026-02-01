import Navbar from "../components/Navbar";
import { useParams, Link } from "react-router-dom";
import { 
  MapPin, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  AlertCircle, 
  Eye,
  Share2, 
  Heart,
  MessageSquare,
  ArrowLeft,
  Shield,
  Clock,
  Navigation,
  Users
} from "lucide-react";

export default function MissingPersonDetail() {
  const { id } = useParams();
  
  // Enhanced dummy data
  const person: {
    id: string;
    name: string;
    age: number;
    location: string;
    lastSeen: string;
    lastSeenTime: string;
    description: string;
    physicalDescription: string;
    contactPerson: string;
    contactPhone: string;
    contactEmail: string;
    status: 'active' | 'found' | 'closed';
    caseType: 'critical' | 'recent' | 'longTerm';
    image: string;
    additionalInfo: string;
    rewards: string;
    views: number;
    tips: number;
    shares: number;
  } = {
    id: id || "MP-001",
    name: "Jane Doe",
    age: 34,
    location: "Lagos, Nigeria",
    lastSeen: "December 15, 2024",
    lastSeenTime: "Approximately 2:30 PM",
    description: "Last seen wearing a blue floral dress and black sandals near the Lekki City Center. Carrying a small black backpack. Has a distinctive tattoo of a butterfly on her left wrist.",
    physicalDescription: "Height: 5'6 Medium build, Brown eyes, Black hair (shoulder length)",
    contactPerson: "John Doe (Brother)",
    contactPhone: "+234 800 123 4567",
    contactEmail: "family@example.com",
    status: "active", // active, found, closed
    caseType: "critical", // critical, recent, longTerm
    image: "",
    additionalInfo: "Speaks English and Yoruba fluently. May be traveling to Abuja. Known to frequent local markets.",
    rewards: "₦500,000 reward for information leading to safe return",
    views: 1247,
    tips: 23,
    shares: 156
  };

  const caseStatus = {
    active: { label: "Active Search", color: "bg-blue-100 text-blue-800", border: "border-blue-200" },
    found: { label: "Found", color: "bg-green-100 text-green-800", border: "border-green-200" },
    closed: { label: "Case Closed", color: "bg-gray-100 text-gray-800", border: "border-gray-200" }
  };

  const caseType = {
    critical: { label: "Critical", color: "bg-red-100 text-red-800", border: "border-red-200" },
    recent: { label: "Recent", color: "bg-amber-100 text-amber-800", border: "border-amber-200" },
    longTerm: { label: "Long-term", color: "bg-purple-100 text-purple-800", border: "border-purple-200" }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Back Button */}
        <Link
          to="/missing-persons"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Missing Persons
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Person Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Header with Status */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex flex-wrap items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <h1 className="text-3xl font-bold text-gray-900 mr-3">{person.name}</h1>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${caseStatus[person.status].color} ${caseStatus[person.status].border}`}>
                        {caseStatus[person.status].label}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${caseType[person.caseType].color} ${caseType[person.caseType].border}`}>
                        {caseType[person.caseType].label} Case
                      </span>
                      <span className="mx-2">•</span>
                      <span>Case ID: {person.id}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-2 sm:mt-0">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Heart className="h-5 w-5 text-gray-400 hover:text-red-500" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Share2 className="h-5 w-5 text-gray-400 hover:text-blue-500" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Person Details */}
              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Photo */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-30"></div>
                      <img
                        src={person.image || "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face"}
                        alt={person.name}
                        className="relative w-64 h-64 rounded-2xl object-cover border-4 border-white shadow-2xl"
                      />
                    </div>
                    
                    {/* Stats */}
                    <div className="flex justify-center space-x-6 mt-6 text-center">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{person.views}</div>
                        <div className="text-xs text-gray-600 flex items-center justify-center">
                          <Eye className="h-3 w-3 mr-1" /> Views
                        </div>
                      </div>
                      <div className="h-8 w-px bg-gray-300"></div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{person.tips}</div>
                        <div className="text-xs text-gray-600 flex items-center justify-center">
                          <MessageSquare className="h-3 w-3 mr-1" /> Tips
                        </div>
                      </div>
                      <div className="h-8 w-px bg-gray-300"></div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{person.shares}</div>
                        <div className="text-xs text-gray-600 flex items-center justify-center">
                          <Share2 className="h-3 w-3 mr-1" /> Shares
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-500 mb-2 flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            Personal Details
                          </h3>
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <div className="w-24 text-gray-600">Age:</div>
                              <div className="font-medium text-gray-900">{person.age} years</div>
                            </div>
                            <div className="flex items-start">
                              <div className="w-24 text-gray-600 mt-1">Physical:</div>
                              <div className="font-medium text-gray-900">{person.physicalDescription}</div>
                            </div>
                            <div className="flex items-start">
                              <div className="w-24 text-gray-600 mt-1">Additional:</div>
                              <div className="font-medium text-gray-900">{person.additionalInfo}</div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-semibold text-gray-500 mb-2 flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            Last Seen
                          </h3>
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                              <div>
                                <div className="font-medium text-gray-900">{person.lastSeen}</div>
                                <div className="text-sm text-gray-600">{person.lastSeenTime}</div>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 text-gray-400 mr-3" />
                              <div className="font-medium text-gray-900">{person.location}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-500 mb-2 flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            Contact Information
                          </h3>
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <User className="h-4 w-4 text-gray-400 mr-3" />
                              <div className="font-medium text-gray-900">{person.contactPerson}</div>
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 text-gray-400 mr-3" />
                              <a href={`tel:${person.contactPhone}`} className="font-medium text-blue-600 hover:text-blue-700">
                                {person.contactPhone}
                              </a>
                            </div>
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 text-gray-400 mr-3" />
                              <a href={`mailto:${person.contactEmail}`} className="font-medium text-blue-600 hover:text-blue-700">
                                {person.contactEmail}
                              </a>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-semibold text-gray-500 mb-2 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-2" />
                            Last Seen Wearing
                          </h3>
                          <p className="text-gray-900 font-medium">{person.description}</p>
                        </div>
                      </div>
                    </div>

                    {/* Reward Notice */}
                    {person.rewards && (
                      <div className="mt-8 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl">
                        <div className="flex items-center">
                          <AlertCircle className="h-5 w-5 text-amber-600 mr-3" />
                          <div>
                            <div className="font-bold text-amber-900">Reward Offered</div>
                            <div className="text-amber-800">{person.rewards}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 pt-8 border-t border-gray-100">
                  <div className="flex flex-wrap gap-4">
                    <Link
                      to={`/report-sighting?case=${person.id}`}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-center"
                    >
                      Report Sighting
                    </Link>
                    <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                      Download Poster
                    </button>
                    <button className="flex-1 bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300">
                      Share Information
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Additional Info & Safety */}
          <div className="space-y-6">
            {/* Safety Tips */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Shield className="h-5 w-5 text-blue-600 mr-2" />
                Safety Information
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 mr-3"></div>
                  <span className="text-sm text-gray-700">Do not approach if you feel unsafe</span>
                </li>
                <li className="flex items-start">
                  <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 mr-3"></div>
                  <span className="text-sm text-gray-700">Note the exact time and location</span>
                </li>
                <li className="flex items-start">
                  <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 mr-3"></div>
                  <span className="text-sm text-gray-700">Take photos if safe to do so</span>
                </li>
                <li className="flex items-start">
                  <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 mr-3"></div>
                  <span className="text-sm text-gray-700">Contact authorities immediately</span>
                </li>
              </ul>
            </div>

            {/* Emergency Contact */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                Emergency Contact
              </h3>
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 border border-red-100">
                  <div className="text-sm text-gray-600 mb-1">24/7 Hotline</div>
                  <div className="text-2xl font-bold text-red-600">0800-FIND-HOPE</div>
                </div>
                <p className="text-sm text-gray-700">
                  For immediate assistance or urgent information about this case.
                </p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <Eye className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">New tip received</div>
                    <div className="text-xs text-gray-500">2 hours ago</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <Share2 className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Shared on social media</div>
                    <div className="text-xs text-gray-500">Yesterday</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <MessageSquare className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Family updated information</div>
                    <div className="text-xs text-gray-500">3 days ago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}