  "use client";

  import { useState, useEffect } from "react";
  import { useSession, signOut } from "next-auth/react";
  import {
    User as UserIcon, Mail, ShieldCheck, LogOut, Coffee, Package,
    Edit, Phone, CheckCircle, X, Home, MapPin, Plus, ChevronDown, ChevronUp
  } from "lucide-react";
  import Link from "next/link";
  import { EspressoSpinner } from "@/components";
  import { useRouter } from "next/navigation";
  import { Nunito } from 'next/font/google';
  import toast, { Toaster } from 'react-hot-toast';

  // Initialize Nunito font
  const nunito = Nunito({
    subsets: ['latin'],
    display: 'swap',
    weight: ['400', '500', '600', '700', '800'],
    variable: '--font-nunito',
  });

  // Define an extended user type to include additional fields
  interface ExtendedUser {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: string | null;
    phone?: string | null;
    image?: string | null;
    bio?: string | null;
    addresses?: Address[];
  }

  // Define interface for address
  interface Address {
    id: string;
    label: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  }

  // Define interface for form data
  interface ProfileFormData {
    name: string;
    phone: string;
    bio: string;
    addresses: Address[];
  }

  const UserProfile = () => {
    const { data: session, status, update } = useSession();
    const [navbarHeight, setNavbarHeight] = useState(72); // Default value
    const [editing, setEditing] = useState(false);
    const [addressFormOpen, setAddressFormOpen] = useState(false);
    const [addressesExpanded, setAddressesExpanded] = useState(true);
    const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

    const [editedProfile, setEditedProfile] = useState<ProfileFormData>({
      name: '',
      phone: '',
      bio: '',
      addresses: []
    });

    const [newAddress, setNewAddress] = useState<Omit<Address, 'id'>>({
      label: '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      isDefault: false
    });

    // Effect to initialize edited profile from session
    useEffect(() => {
      if (session?.user) {
        const user = session.user as ExtendedUser;
        // In a real app, you would fetch addresses from an API
        const mockAddresses: Address[] = user.addresses || [
          {
            id: '1',
            label: 'Home',
            street: '123 Coffee Lane',
            city: 'Manila',
            state: 'Metro Manila',
            postalCode: '1000',
            country: 'Philippines',
            isDefault: true
          }
        ];

        setEditedProfile({
          name: user.name || '',
          phone: user.phone || '',
          bio: user.bio || '',
          addresses: mockAddresses
        });
      }
    }, [session]);

    // Effect to measure navbar height
    useEffect(() => {
      const updateNavbarHeight = () => {
        const navbar = document.querySelector('header');
        if (navbar) {
          setNavbarHeight(navbar.clientHeight);
        }
      };

      // Update on initial render
      updateNavbarHeight();

      // Update on window resize
      window.addEventListener('resize', updateNavbarHeight);

      return () => {
        window.removeEventListener('resize', updateNavbarHeight);
      };
    }, []);

    // Loading state
    if (status === "loading") {
      return (
        <div className={`${nunito.className} flex items-center justify-center min-h-screen`}>
          <EspressoSpinner />
        </div>
      );
    }

    // Not logged in state
    if (!session) {
      return (
        <div className={`${nunito.className} flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4`}>
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserIcon className="h-8 w-8 text-gray-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">You are not logged in</h1>
            <p className="text-gray-600 mb-6">Please sign in to view your profile</p>
            <Link
              href="/account/sign-in"
              className="inline-block bg-brown-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-brown-primary-hover transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      );
    }

    const handleLogout = () => {
      signOut({});
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setEditedProfile(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleEditToggle = () => {
      if (editing) {
        // Cancel editing, reset form
        const user = session.user as ExtendedUser;
        setEditedProfile({
          name: user.name || '',
          phone: user.phone || '',
          bio: user.bio || '',
          addresses: user.addresses || []
        });
        setAddressFormOpen(false);
        setEditingAddressId(null);
      }
      setEditing(!editing);
    };

    const handleSaveProfile = async () => {
      try {
        // Show loading toast
        const loadingToast = toast.loading("Updating your profile...");

        const response = await fetch(`/api/auth/profile?id=${session.user.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editedProfile),
        });

        // For now, let's simulate a successful update
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Update the session with the new data
        await update({
          ...session,
          user: {
            ...session.user,
            name: editedProfile.name,
            phone: editedProfile.phone,
            bio: editedProfile.bio,
            addresses: editedProfile.addresses
          }
        });

        // Dismiss loading toast and show success
        toast.dismiss(loadingToast);
        toast.success("Profile updated successfully");

        // Exit edit mode
        setEditing(false);
        setAddressFormOpen(false);
        setEditingAddressId(null);
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile. Please try again.");
      }
    };

    const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : false;

      setNewAddress(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    };

    const handleAddressEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, addressId: string) => {
      const { name, value, type } = e.target;
      const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : false;

      setEditedProfile(prev => ({
        ...prev,
        addresses: prev.addresses.map(address =>
          address.id === addressId
            ? { ...address, [name]: type === 'checkbox' ? checked : value }
            : address
        )
      }));
    };

    const addNewAddress = () => {
      // Validate form
      if (!newAddress.label || !newAddress.street || !newAddress.city || !newAddress.postalCode || !newAddress.country) {
        toast.error("Please fill in all required address fields");
        return;
      }

      const newId = Math.random().toString(36).substring(2, 9); // Simple ID generation

      // If this is the first address or isDefault is true, make it the default
      let isDefault = newAddress.isDefault;
      if (editedProfile.addresses.length === 0) {
        isDefault = true;
      }

      // If this is set as default, remove default from other addresses
      let updatedAddresses = [...editedProfile.addresses];
      if (isDefault) {
        updatedAddresses = updatedAddresses.map(address => ({
          ...address,
          isDefault: false
        }));
      }

      // Add the new address to the list
      setEditedProfile(prev => ({
        ...prev,
        addresses: [
          ...updatedAddresses,
          {
            id: newId,
            ...newAddress,
            isDefault
          }
        ]
      }));

      // Reset the form
      setNewAddress({
        label: '',
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        isDefault: false
      });

      setAddressFormOpen(false);
      toast.success("Address added successfully");
    };

    const removeAddress = (addressId: string) => {
      // Check if this is the only address or if it's the default address
      const addressToRemove = editedProfile.addresses.find(a => a.id === addressId);
      const remainingAddresses = editedProfile.addresses.filter(a => a.id !== addressId);

      if (addressToRemove?.isDefault && remainingAddresses.length > 0) {
        // If removing a default address, make the first remaining address the default
        remainingAddresses[0].isDefault = true;
      }

      setEditedProfile(prev => ({
        ...prev,
        addresses: remainingAddresses
      }));

      toast.success("Address removed");
    };

    const setDefaultAddress = (addressId: string) => {
      setEditedProfile(prev => ({
        ...prev,
        addresses: prev.addresses.map(address => ({
          ...address,
          isDefault: address.id === addressId
        }))
      }));
    };

    const startEditingAddress = (addressId: string) => {
      setEditingAddressId(addressId);
    };

    const cancelEditingAddress = () => {
      setEditingAddressId(null);
    };

    // Cast user to ExtendedUser to access additional properties
    const user = session.user as ExtendedUser;

    return (
      <div
        className={`${nunito.className} max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50 pb-12`}
        style={{ paddingTop: `${navbarHeight + 24}px` }}
      >
        {/* Toast notifications */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              fontFamily: 'var(--font-nunito)',
            },
          }}
        />

        <div className="max-w-3xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-brown-primary to-brown-primary-hover h-32 relative">
              <div className="absolute -bottom-12 left-8">
                <div className="bg-white rounded-full p-2 shadow-md w-24 h-24 flex items-center justify-center">
                  <div className="bg-yellow-primary rounded-full w-20 h-20 flex items-center justify-center">
                    <span className="text-3xl font-bold text-brown-primary">
                      {editedProfile.name?.charAt(0) || user.email?.charAt(0) || "U"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-16 pb-6 px-8">
              <div className="flex justify-between items-start">
                <div>
                  {editing ? (
                    <input
                      type="text"
                      name="name"
                      value={editedProfile.name}
                      onChange={handleInputChange}
                      className="text-2xl font-bold text-gray-900 border-b border-yellow-primary bg-transparent focus:outline-none focus:border-brown-primary px-1 py-0.5 mb-1 font-nunito"
                      placeholder="Your name"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold text-gray-900">
                      {user.name || user.email}
                    </h1>
                  )}
                  <p className="text-gray-500 flex items-center mt-1">
                    <ShieldCheck className="h-4 w-4 mr-1 text-brown-primary" />
                    {user.role}
                  </p>
                </div>

                <div className="flex space-x-3">
                  {editing ? (
                    <>
                      <button
                        onClick={handleSaveProfile}
                        className="flex items-center text-green-600 hover:text-green-700 transition-colors"
                      >
                        <CheckCircle className="h-5 w-5 mr-1" />
                        <span className="font-medium">Save</span>
                      </button>
                      <button
                        onClick={handleEditToggle}
                        className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        <X className="h-5 w-5 mr-1" />
                        <span className="font-medium">Cancel</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleEditToggle}
                        className="flex items-center text-brown-primary hover:text-brown-primary-hover transition-colors"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        <span className="font-medium">Edit Profile</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center text-red-500 hover:text-red-700 transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-1" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* User Information */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Account Information</h2>

            <div className="space-y-5">
              <div className="flex items-start">
                <div className="bg-yellow-50 rounded-full p-2 mr-4 flex-shrink-0">
                  <UserIcon className="h-5 w-5 text-brown-primary" />
                </div>
                <div className="flex-grow">
                  <p className="text-sm text-gray-500">Full Name</p>
                  {editing ? (
                    <input
                      type="text"
                      name="name"
                      value={editedProfile.name}
                      onChange={handleInputChange}
                      className="w-full font-medium text-gray-900 border-b border-yellow-primary bg-transparent focus:outline-none focus:border-brown-primary px-1 py-1 font-nunito"
                      placeholder="Your full name"
                    />
                  ) : (
                    <p className="font-medium text-gray-900">{user.name || "Not set"}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-yellow-50 rounded-full p-2 mr-4 flex-shrink-0">
                  <Mail className="h-5 w-5 text-brown-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="font-medium text-gray-900">{user.email}</p>
                  <p className="text-xs text-gray-500 mt-1">(Email cannot be changed)</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-yellow-50 rounded-full p-2 mr-4 flex-shrink-0">
                  <Phone className="h-5 w-5 text-brown-primary" />
                </div>
                <div className="flex-grow">
                  <p className="text-sm text-gray-500">Phone Number</p>
                  {editing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={editedProfile.phone || ''}
                      onChange={handleInputChange}
                      className="w-full font-medium text-gray-900 border-b border-yellow-primary bg-transparent focus:outline-none focus:border-brown-primary px-1 py-1 font-nunito"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <p className="font-medium text-gray-900">
                      {user.phone || (
                        <span className="text-gray-400 italic">Not added yet</span>
                      )}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-yellow-50 rounded-full p-2 mr-4 flex-shrink-0">
                  <ShieldCheck className="h-5 w-5 text-brown-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account Role</p>
                  <p className="font-medium text-gray-900">{user.role}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-yellow-50 rounded-full p-2 mr-4 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brown-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="flex-grow">
                  <p className="text-sm text-gray-500">Bio</p>
                  {editing ? (
                    <textarea
                      name="bio"
                      value={editedProfile.bio || ''}
                      onChange={handleInputChange}
                      className="w-full font-medium text-gray-900 border border-yellow-primary bg-transparent focus:outline-none focus:border-brown-primary px-2 py-2 rounded-md font-nunito mt-1"
                      placeholder="Tell us a bit about yourself"
                      rows={3}
                    />
                  ) : (
                    <p className="font-medium text-gray-900">
                      {editedProfile.bio || (
                        <span className="text-gray-400 italic">No bio added</span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Addresses Section */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                Delivery Addresses
                <button
                  onClick={() => setAddressesExpanded(!addressesExpanded)}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  {addressesExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </h2>

              {editing && !addressFormOpen && (
                <button
                  onClick={() => setAddressFormOpen(true)}
                  className="flex items-center text-brown-primary hover:text-brown-primary-hover transition-colors text-sm"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  <span className="font-medium">Add New Address</span>
                </button>
              )}
            </div>

            {addressesExpanded && (
              <div className="space-y-6">
                {/* New Address Form */}
                {editing && addressFormOpen && (
                  <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                    <h3 className="font-semibold text-brown-primary mb-3">Add New Address</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Address Label*</label>
                        <input
                          type="text"
                          name="label"
                          value={newAddress.label}
                          onChange={handleNewAddressChange}
                          placeholder="Home, Work, etc."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-200"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Country*</label>
                        <select
                          name="country"
                          value={newAddress.country}
                          onChange={handleNewAddressChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-200"
                          required
                        >
                          <option value="">Select Country</option>
                          <option value="Philippines">Philippines</option>
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          {/* Add more countries as needed */}
                        </select>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm text-gray-600 mb-1">Street Address*</label>
                      <input
                        type="text"
                        name="street"
                        value={newAddress.street}
                        onChange={handleNewAddressChange}
                        placeholder="123 Coffee Street"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-200"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">City*</label>
                        <input
                          type="text"
                          name="city"
                          value={newAddress.city}
                          onChange={handleNewAddressChange}
                          placeholder="City"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-200"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600 mb-1">State/Province</label>
                        <input
                          type="text"
                          name="state"
                          value={newAddress.state}
                          onChange={handleNewAddressChange}
                          placeholder="State/Province"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Postal Code*</label>
                        <input
                          type="text"
                          name="postalCode"
                          value={newAddress.postalCode}
                          onChange={handleNewAddressChange}
                          placeholder="Postal Code"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-200"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        id="isDefault"
                        name="isDefault"
                        checked={newAddress.isDefault}
                        onChange={handleNewAddressChange}
                        className="w-4 h-4 text-brown-primary focus:ring-brown-primary border-gray-300 rounded"
                      />
                      <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
                        Set as default address
                      </label>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setAddressFormOpen(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={addNewAddress}
                        className="px-4 py-2 text-sm font-medium text-white bg-brown-primary rounded-md hover:bg-brown-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-primary"
                      >
                        Add Address
                      </button>
                    </div>
                  </div>
                )}

                {/* Address List */}
                {editedProfile.addresses.length === 0 ? (
                  <div className="text-center py-6 bg-gray-50 rounded-lg">
                    <Home className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No addresses saved yet</p>
                    {editing && (
                      <button
                        onClick={() => setAddressFormOpen(true)}
                        className="mt-2 text-brown-primary hover:text-brown-primary-hover font-medium text-sm"
                      >
                        Add your first address
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {editedProfile.addresses.map((address) => (
                      <div
                        key={address.id}
                        className={`border rounded-lg p-4 ${address.isDefault ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'}`}
                      >
                        {/* Address header with edit/delete controls */}
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <span className="font-medium text-gray-900">{address.label}</span>
                            {address.isDefault && (
                              <span className="ml-2 px-2 py-0.5 bg-yellow-200 text-brown-primary text-xs rounded-full">
                                Default
                              </span>
                            )}
                          </div>

                          {editing && (
                            <div className="flex space-x-2">
                              {editingAddressId === address.id ? (
                                <>
                                  <button
                                    onClick={cancelEditingAddress}
                                    className="text-gray-500 hover:text-gray-700"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => startEditingAddress(address.id)}
                                    className="text-blue-500 hover:text-blue-700"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => removeAddress(address.id)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>

                        {/* If in edit mode for this address */}
                        {editing && editingAddressId === address.id ? (
                          <div className="mt-2 space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs text-gray-500">Label</label>
                                <input
                                  type="text"
                                  name="label"
                                  value={address.label}
                                  onChange={(e) => handleAddressEditChange(e, address.id)}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500">Country</label>
                                <select
                                  name="country"
                                  value={address.country}
                                  onChange={(e) => handleAddressEditChange(e, address.id)}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                >
                                  <option value="">Select Country</option>
                                  <option value="Philippines">Philippines</option>
                                  <option value="United States">United States</option>
                                  <option value="Canada">Canada</option>
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs text-gray-500">Street Address</label>
                              <input
                                type="text"
                                name="street"
                                value={address.street}
                                onChange={(e) => handleAddressEditChange(e, address.id)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-xs text-gray-500">City</label>
                                <input
                                  type="text"
                                  name="city"
                                  value={address.city}
                                  onChange={(e) => handleAddressEditChange(e, address.id)}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500">State/Province</label>
                                <input
                                  type="text"
                                  name="state"
                                  value={address.state}
                                  onChange={(e) => handleAddressEditChange(e, address.id)}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500">Postal Code</label>
                                <input
                                  type="text"
                                  name="postalCode"
                                  value={address.postalCode}
                                  onChange={(e) => handleAddressEditChange(e, address.id)}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                />
                              </div>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id={`isDefault-${address.id}`}
                                name="isDefault"
                                checked={address.isDefault}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setDefaultAddress(address.id);
                                  }
                                }}
                                className="w-4 h-4 text-brown-primary focus:ring-brown-primary border-gray-300 rounded"
                              />
                              <label htmlFor={`isDefault-${address.id}`} className="ml-2 text-xs text-gray-700">
                                Set as default address
                              </label>
                            </div>

                            <div className="flex justify-end space-x-2 mt-3">
                              <button
                                onClick={cancelEditingAddress}
                                className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => setEditingAddressId(null)}
                                className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                              >
                                Save Changes
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            {/* Regular address display */}
                            <div className="flex items-start mt-1">
                              <MapPin className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                              <div>
                                <p className="text-gray-700">
                                  {address.street}, {address.city}, {address.state ? `${address.state},` : ''} {address.postalCode}
                                </p>
                                <p className="text-gray-700">{address.country}</p>
                              </div>
                            </div>

                            {/* Show 'Make Default' button only in edit mode and if not already default */}
                            {editing && !address.isDefault && (
                              <button
                                onClick={() => setDefaultAddress(address.id)}
                                className="mt-2 text-xs text-brown-primary hover:text-brown-primary-hover font-medium"
                              >
                                Make Default
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Link href="/profile/orders" className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow flex items-center">
              <div className="bg-yellow-50 rounded-full p-3 mr-4">
                <Package className="h-6 w-6 text-brown-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">My Orders</h3>
                <p className="text-sm text-gray-500">View your order history</p>
              </div>
            </Link>

            <Link href="/products" className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow flex items-center">
              <div className="bg-yellow-50 rounded-full p-3 mr-4">
                <Coffee className="h-6 w-6 text-brown-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Browse Products</h3>
                <p className="text-sm text-gray-500">Discover our coffee selection</p>
              </div>
            </Link>
          </div>

          {/* Account Management Section (only show when not editing) */}
          {!editing && (
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Account Management</h2>

              <div className="space-y-3">
                <button className="w-full text-left flex items-center justify-between bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brown-primary mr-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Password & Security</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>

                <button className="w-full text-left flex items-center justify-between bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brown-primary mr-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1 2H8l-1-2H5V5z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Notification Preferences</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>

                <button className="w-full text-left flex items-center justify-between bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brown-primary mr-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Privacy Settings</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center justify-between bg-red-50 hover:bg-red-100 p-4 rounded-lg transition-colors text-red-600"
                >
                  <div className="flex items-center">
                    <LogOut className="h-5 w-5 mr-3" />
                    <span className="font-medium">Log Out</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  export default UserProfile;