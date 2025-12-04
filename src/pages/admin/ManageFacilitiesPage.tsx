import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { MobileSidebar } from '../../components/admin/MobileSidebar';
import { Card, Button, LoadingSpinner, Modal } from '../../ui';
import { Form } from 'react-bootstrap';

type Facility = {
  id: string;
  name: string;
  location?: string;
  geography?: string;
  createdAt: string;
};

const ManageFacilitiesPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filters, setFilters] = useState({
    geography: '',
  });
  const [newFacility, setNewFacility] = useState({
    name: '',
    location: '',
    geography: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // TODO: Fetch facilities from API
    const fetchFacilities = async () => {
      setLoading(true);
      setTimeout(() => {
        const mockData: Facility[] = [
          {
            id: '1',
            name: 'Primary School A',
            location: 'City A',
            geography: 'Region 1',
            createdAt: '2024-01-01',
          },
          {
            id: '2',
            name: 'Primary School B',
            location: 'City B',
            geography: 'Region 2',
            createdAt: '2024-01-02',
          },
          {
            id: '3',
            name: 'Primary School C',
            location: 'City A',
            geography: 'Region 1',
            createdAt: '2024-01-03',
          },
        ];
        setFacilities(mockData);
        setFilteredFacilities(mockData);
        setLoading(false);
      }, 500);
    };
    void fetchFacilities();
  }, []);

  useEffect(() => {
    let filtered = [...facilities];
    if (filters.geography) {
      filtered = filtered.filter((f) =>
        f.geography?.toLowerCase().includes(filters.geography.toLowerCase())
      );
    }
    setFilteredFacilities(filtered);
    setCurrentPage(1);
  }, [filters, facilities]);

  const handleAddFacility = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit to API
    const facility: Facility = {
      id: String(facilities.length + 1),
      name: newFacility.name,
      location: newFacility.location,
      geography: newFacility.geography,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setFacilities([...facilities, facility]);
    setShowAddModal(false);
    setNewFacility({ name: '', location: '', geography: '' });
  };

  const handleRemoveFacility = (id: string) => {
    // TODO: Confirm and remove via API
    if (window.confirm('Are you sure you want to remove this facility?')) {
      setFacilities(facilities.filter((f) => f.id !== id));
    }
  };

  const paginatedFacilities = filteredFacilities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredFacilities.length / itemsPerPage);

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
            <h1 className="h4 sm:h3 fw-bold text-dark mb-1 sm:mb-2">Manage Facilities</h1>
            <p className="text-secondary text-sm sm:text-base">Add and remove facility records</p>
          </div>
          <Button className="w-100 w-sm-auto" icon={<i className="fas fa-plus"></i>} onClick={() => setShowAddModal(true)}>
            Add Facility
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-3 sm:mb-4">
          <Form.Group>
            <Form.Label className="text-dark text-sm sm:text-base">Filter by Geography</Form.Label>
            <Form.Select
              size="sm"
              className="form-select-sm"
              value={filters.geography}
              onChange={(e) => setFilters({ ...filters, geography: e.target.value })}
            >
              <option value="">All Regions</option>
              {/* TODO: Populate from API */}
            </Form.Select>
          </Form.Group>
        </Card>

        {/* List */}
        <Card>
          <div className="table-responsive" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table className="table table-hover table-sm">
              <thead>
                <tr>
                  <th className="text-nowrap">Name</th>
                  <th className="text-nowrap d-none d-md-table-cell">Location</th>
                  <th className="text-nowrap d-none d-lg-table-cell">Geography</th>
                  <th className="text-nowrap d-none d-sm-table-cell">Created</th>
                  <th className="text-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedFacilities.map((facility) => (
                  <tr key={facility.id}>
                    <td>
                      <div className="fw-bold">{facility.name}</div>
                      <small className="text-secondary d-md-none">
                        {facility.location || '—'} • {facility.geography || '—'}
                      </small>
                    </td>
                    <td className="d-none d-md-table-cell">{facility.location || '—'}</td>
                    <td className="d-none d-lg-table-cell">{facility.geography || '—'}</td>
                    <td className="d-none d-sm-table-cell text-nowrap">{new Date(facility.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        className="w-100 w-sm-auto"
                        onClick={() => handleRemoveFacility(facility.id)}
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
          title="Add New Facility"
          footer={
            <>
              <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" form="addFacilityForm">
                Add Facility
              </Button>
            </>
          }
        >
          <Form id="addFacilityForm" onSubmit={handleAddFacility}>
            <Form.Group className="mb-3">
              <Form.Label className="text-dark">Facility Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter facility name"
                value={newFacility.name}
                onChange={(e) => setNewFacility({ ...newFacility, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-dark">Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter location"
                value={newFacility.location}
                onChange={(e) => setNewFacility({ ...newFacility, location: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-dark">Geography / Region</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter geography/region"
                value={newFacility.geography}
                onChange={(e) => setNewFacility({ ...newFacility, geography: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default ManageFacilitiesPage;

