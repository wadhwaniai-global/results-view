import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { MobileSidebar } from '../../components/admin/MobileSidebar';
import { Card, Button, LoadingSpinner, Modal } from '../../ui';
import { Form } from 'react-bootstrap';

type TestAdmin = {
  id: string;
  phoneNumber: string;
  name?: string;
  assignedCampaigns: string[];
  associatedFacilities: string[];
  lastActive?: string;
};

const ManageTestAdminsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [testAdmins, setTestAdmins] = useState<TestAdmin[]>([]);
  const [filteredTestAdmins, setFilteredTestAdmins] = useState<TestAdmin[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filters, setFilters] = useState({
    campaign: '',
    facility: '',
  });
  const [newTestAdmin, setNewTestAdmin] = useState({
    phoneNumber: '',
    name: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // TODO: Fetch test admins from API
    const fetchTestAdmins = async () => {
      setLoading(true);
      setTimeout(() => {
        const mockData: TestAdmin[] = [
          {
            id: '1',
            phoneNumber: '+1234567890',
            name: 'John Doe',
            assignedCampaigns: ['Campaign 1', 'Campaign 2'],
            associatedFacilities: ['Facility A', 'Facility B'],
            lastActive: '2024-01-15',
          },
          {
            id: '2',
            phoneNumber: '+0987654321',
            name: 'Jane Smith',
            assignedCampaigns: ['Campaign 1'],
            associatedFacilities: ['Facility C'],
            lastActive: '2024-01-14',
          },
        ];
        setTestAdmins(mockData);
        setFilteredTestAdmins(mockData);
        setLoading(false);
      }, 500);
    };
    void fetchTestAdmins();
  }, []);

  useEffect(() => {
    let filtered = [...testAdmins];
    if (filters.campaign) {
      filtered = filtered.filter((ta) =>
        ta.assignedCampaigns.some((c) => c.toLowerCase().includes(filters.campaign.toLowerCase()))
      );
    }
    if (filters.facility) {
      filtered = filtered.filter((ta) =>
        ta.associatedFacilities.some((f) => f.toLowerCase().includes(filters.facility.toLowerCase()))
      );
    }
    setFilteredTestAdmins(filtered);
    setCurrentPage(1);
  }, [filters, testAdmins]);

  const handleAddTestAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit to API
    const newAdmin: TestAdmin = {
      id: String(testAdmins.length + 1),
      phoneNumber: newTestAdmin.phoneNumber,
      name: newTestAdmin.name,
      assignedCampaigns: [],
      associatedFacilities: [],
    };
    setTestAdmins([...testAdmins, newAdmin]);
    setShowAddModal(false);
    setNewTestAdmin({ phoneNumber: '', name: '' });
  };

  const handleRemoveTestAdmin = (id: string) => {
    // TODO: Confirm and remove via API
    if (window.confirm('Are you sure you want to remove this test admin?')) {
      setTestAdmins(testAdmins.filter((ta) => ta.id !== id));
    }
  };

  const paginatedAdmins = filteredTestAdmins.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredTestAdmins.length / itemsPerPage);

  if (loading) {
    return (
      <div className="d-flex flex-column flex-md-row">
        <AdminSidebar />
        <MobileSidebar className="d-md-none" />
        <div className="flex-grow-1 p-2 sm:p-4 pt-5 pt-md-4">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column flex-md-row">
      <AdminSidebar />
      <MobileSidebar className="d-md-none" />
      <div className="flex-grow-1 p-2 sm:p-4 pt-5 pt-md-4">
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-3 sm:mb-4 gap-2">
          <div>
            <h1 className="h4 sm:h3 fw-bold text-dark mb-1 sm:mb-2">Manage Test Admins</h1>
            <p className="text-secondary text-sm sm:text-base">Add and remove test administrator accounts</p>
          </div>
          <Button className="w-100 w-sm-auto" icon={<i className="fas fa-plus"></i>} onClick={() => setShowAddModal(true)}>
            Add Test Admin
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-3 sm:mb-4">
          <div className="row g-2 sm:g-3">
            <div className="col-12 col-md-6">
              <Form.Group>
                <Form.Label className="text-dark text-sm sm:text-base">Filter by Campaign</Form.Label>
                <Form.Select
                  size="sm"
                  className="form-select-sm"
                  value={filters.campaign}
                  onChange={(e) => setFilters({ ...filters, campaign: e.target.value })}
                >
                  <option value="">All Campaigns</option>
                  {/* TODO: Populate from API */}
                </Form.Select>
              </Form.Group>
            </div>
            <div className="col-12 col-md-6">
              <Form.Group>
                <Form.Label className="text-dark text-sm sm:text-base">Filter by Facility</Form.Label>
                <Form.Select
                  size="sm"
                  className="form-select-sm"
                  value={filters.facility}
                  onChange={(e) => setFilters({ ...filters, facility: e.target.value })}
                >
                  <option value="">All Facilities</option>
                  {/* TODO: Populate from API */}
                </Form.Select>
              </Form.Group>
            </div>
          </div>
        </Card>

        {/* List */}
        <Card>
          <div className="table-responsive" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table className="table table-hover table-sm">
              <thead>
                <tr>
                  <th className="text-nowrap">Phone</th>
                  <th className="text-nowrap">Name</th>
                  <th className="text-nowrap d-none d-md-table-cell">Campaigns</th>
                  <th className="text-nowrap d-none d-lg-table-cell">Facilities</th>
                  <th className="text-nowrap d-none d-sm-table-cell">Last Active</th>
                  <th className="text-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedAdmins.map((admin) => (
                  <tr key={admin.id}>
                    <td className="text-nowrap">{admin.phoneNumber}</td>
                    <td>{admin.name || '—'}</td>
                    <td className="d-none d-md-table-cell">
                      {admin.assignedCampaigns.length > 0 ? (
                        <div className="d-flex flex-wrap gap-1">
                          {admin.assignedCampaigns.map((campaign, idx) => (
                            <span key={idx} className="badge bg-primary text-xs">
                              {campaign}
                            </span>
                          ))}
                        </div>
                      ) : (
                        'None'
                      )}
                    </td>
                    <td className="d-none d-lg-table-cell">
                      {admin.associatedFacilities.length > 0 ? (
                        <div className="d-flex flex-wrap gap-1">
                          {admin.associatedFacilities.map((facility, idx) => (
                            <span key={idx} className="badge bg-secondary text-xs">
                              {facility}
                            </span>
                          ))}
                        </div>
                      ) : (
                        'None'
                      )}
                    </td>
                    <td className="d-none d-sm-table-cell">{admin.lastActive ? new Date(admin.lastActive).toLocaleDateString() : '—'}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        className="w-100 w-sm-auto"
                        onClick={() => handleRemoveTestAdmin(admin.id)}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="text-secondary">
                Page {currentPage} of {totalPages}
              </div>
              <div className="d-flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>

        <Modal
          show={showAddModal}
          onHide={() => setShowAddModal(false)}
          title="Add New Test Admin"
          footer={
            <>
              <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" form="addTestAdminForm">
                Add Test Admin
              </Button>
            </>
          }
        >
          <Form id="addTestAdminForm" onSubmit={handleAddTestAdmin}>
            <Form.Group className="mb-3">
              <Form.Label className="text-dark">Phone Number</Form.Label>
              <Form.Control
                type="tel"
                placeholder="+1234567890"
                value={newTestAdmin.phoneNumber}
                onChange={(e) => setNewTestAdmin({ ...newTestAdmin, phoneNumber: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-dark">Name (Optional)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={newTestAdmin.name}
                onChange={(e) => setNewTestAdmin({ ...newTestAdmin, name: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default ManageTestAdminsPage;

