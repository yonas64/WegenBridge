import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { 
  Heart, 
  Users, 
  Shield, 
  Target, 
  Globe, 
  Award,
  Clock,
  CheckCircle,
  MessageSquare,
  Star,
  BarChart3,
  HeartHandshake
} from "lucide-react";

export default function About() {
  const stats = [
    { value: "1,234+", label: "Families Reunited", icon: <Heart className="h-6 w-6" /> },
    { value: "5,000+", label: "Active Volunteers", icon: <Users className="h-6 w-6" /> },
    { value: "78%", label: "Success Rate", icon: <Target className="h-6 w-6" /> },
    { value: "24/7", label: "Support", icon: <Clock className="h-6 w-6" /> },
  ];

  const values = [
    {
      title: "Compassion First",
      description: "Every case is treated with empathy and understanding.",
      icon: <HeartHandshake className="h-8 w-8" />,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "Community Power",
      description: "We believe in collective effort to reunite families.",
      icon: <Users className="h-8 w-8" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Confidentiality",
      description: "All information is handled with utmost privacy.",
      icon: <Shield className="h-8 w-8" />,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Hope & Persistence",
      description: "We never give up on bringing families together.",
      icon: <Target className="h-8 w-8" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
  ];

  const team = [
    { name: "Dr. Sarah Johnson", role: "Founder & Director", expertise: "Family Psychology" },
    { name: "Michael Chen", role: "Tech Lead", expertise: "Platform Development" },
    { name: "Amina Okeke", role: "Community Manager", expertise: "Volunteer Coordination" },
    { name: "David Brown", role: "Operations Head", expertise: "Case Management" },
  ];

  return (
    <><div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <Navbar />

          {/* Hero Section */}
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-700 text-white">
              <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=" />60" height="60" viewBox="0 0 60 60"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.2"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"{">"}</div>
          </div>

          <div className="relative max-w-7xl mx-auto px-6 py-20">
              <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl backdrop-blur-sm mb-6">
                      <Heart className="h-10 w-10" />
                  </div>
                  <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                      Our Mission: <span className="text-yellow-300">Reuniting Families</span>
                  </h1>
                  <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
                      We leverage technology and community to help find missing loved ones and bring families back together.
                  </p>
              </div>
          </div>
      </div><div className="max-w-7xl mx-auto px-6 py-12">
              {/* Stats Section */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                  {stats.map((stat, index) => (
                      <div
                          key={index}
                          className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                      >
                          <div className="flex justify-center mb-4 text-blue-600">
                              {stat.icon}
                          </div>
                          <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                          <div className="text-gray-600">{stat.label}</div>
                      </div>
                  ))}
              </div>

              {/* Our Story */}
              <div className="mb-16">
                  <div className="text-center mb-12">
                      <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Story</h2>
                      <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
                  </div>

                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                      <div className="grid md:grid-cols-2 gap-8 items-center">
                          <div>
                              <h3 className="text-2xl font-bold text-gray-900 mb-4">From Tragedy to Hope</h3>
                              <p className="text-gray-700 mb-4">
                                  FamilyReconnect was born from personal experience. Our founder, Sarah Johnson, spent months searching
                                  for her missing brother. Through that difficult journey, she realized the power of community and
                                  technology in finding missing persons.
                              </p>
                              <p className="text-gray-700 mb-6">
                                  What started as a personal mission has grown into a nationwide network of volunteers, technology
                                  experts, and caring individuals dedicated to helping others avoid the same pain.
                              </p>
                              <div className="flex items-center text-blue-600">
                                  <CheckCircle className="h-5 w-5 mr-2" />
                                  <span className="font-medium">Registered non-profit since 2020</span>
                              </div>
                          </div>
                          <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-6">
                              <div className="space-y-4">
                                  <div className="flex items-center">
                                      <Award className="h-6 w-6 text-amber-600 mr-3" />
                                      <div>
                                          <div className="font-bold text-gray-900">2023 Innovation Award</div>
                                          <div className="text-sm text-gray-600">Tech for Social Good</div>
                                      </div>
                                  </div>
                                  <div className="flex items-center">
                                      <Globe className="h-6 w-6 text-green-600 mr-3" />
                                      <div>
                                          <div className="font-bold text-gray-900">Active in 12 States</div>
                                          <div className="text-sm text-gray-600">Across Nigeria</div>
                                      </div>
                                  </div>
                                  <div className="flex items-center">
                                      <MessageSquare className="h-6 w-6 text-purple-600 mr-3" />
                                      <div>
                                          <div className="font-bold text-gray-900">5,000+ Success Stories</div>
                                          <div className="text-sm text-gray-600">From families we've helped</div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Our Values */}
              <div className="mb-16">
                  <div className="text-center mb-12">
                      <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
                      <p className="text-gray-600 max-w-2xl mx-auto">
                          These principles guide everything we do at FamilyReconnect
                      </p>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {values.map((value, index) => (
                          <div
                              key={index}
                              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
                          >
                              <div className={`${value.bgColor} p-3 rounded-xl w-fit mb-4`}>
                                  <div className={value.color}>
                                      {value.icon}
                                  </div>
                              </div>
                              <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                              <p className="text-gray-600">{value.description}</p>
                          </div>
                      ))}
                  </div>
              </div>

              {/* How It Works */}
              <div className="mb-16">
                  <div className="text-center mb-12">
                      <h2 className="text-4xl font-bold text-gray-900 mb-4">How We Work</h2>
                      <p className="text-gray-600 max-w-2xl mx-auto">
                          Our proven process for reuniting families
                      </p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                      <div className="grid md:grid-cols-3 gap-8">
                          <div className="text-center">
                              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <span className="text-2xl font-bold">1</span>
                              </div>
                              <h3 className="text-xl font-bold mb-3">Report & Verify</h3>
                              <p className="text-blue-100">Family submits a missing person report which our team verifies</p>
                          </div>

                          <div className="text-center">
                              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <span className="text-2xl font-bold">2</span>
                              </div>
                              <h3 className="text-xl font-bold mb-3">Mobilize Community</h3>
                              <p className="text-blue-100">Alert volunteers and share information through our network</p>
                          </div>

                          <div className="text-center">
                              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <span className="text-2xl font-bold">3</span>
                              </div>
                              <h3 className="text-xl font-bold mb-3">Reunite & Support</h3>
                              <p className="text-blue-100">Coordinate reunification and provide post-reunion support</p>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Team Section */}
              <div className="mb-16">
                  <div className="text-center mb-12">
                      <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
                      <p className="text-gray-600 max-w-2xl mx-auto">
                          Dedicated professionals committed to our mission
                      </p>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {team.map((member, index) => (
                          <div
                              key={index}
                              className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                          >
                              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                                  {member.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                              <div className="text-blue-600 font-medium mb-2">{member.role}</div>
                              <div className="text-sm text-gray-600">{member.expertise}</div>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Call to Action */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12 border border-blue-100">
                  <div className="text-center max-w-3xl mx-auto">
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">
                          Join Our Mission
                      </h2>
                      <p className="text-gray-700 mb-8 text-lg">
                          Whether you're looking for a missing loved one or want to help others,
                          you're not alone. Together, we can make a difference.
                      </p>
                      <div className="flex flex-wrap justify-center gap-4">
                          <Link
                              to="/report"
                              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                          >
                              Report a Case
                          </Link>
                          <Link
                              to="/register"
                              className="bg-white text-blue-600 border border-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors duration-300"
                          >
                              Become a Volunteer
                          </Link>
                      </div>
                  </div>
              </div>

              {/* Contact Footer */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="text-center text-gray-600">
                      <p className="mb-2">
                          Need to reach us directly? Email: <span className="text-blue-600 font-medium">help@familyreconnect.org</span>
                      </p>
                      <p className="text-sm">
                          Emergency hotline available 24/7: <span className="text-red-600 font-bold">0800-FIND-HOPE</span>
                      </p>
                  </div>
              </div>
          </div></>
  );
}