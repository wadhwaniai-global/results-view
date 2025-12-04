import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { MobileSidebar } from '../../components/admin/MobileSidebar';
import { Card, Button, LoadingSpinner, Modal } from '../../ui';
import { Form } from 'react-bootstrap';

type Campaign = {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'closed';
  facilities: string[];
  testAdmins: { id: string; name: string; assignedFacilities: string[] }[];
  createdAt: string;
};

const ManageCampaignsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [availableFacilities, setAvailableFacilities] = useState<string[]>([]);
  const [availableTestAdmins, setAvailableTestAdmins] = useState<{ id: string; name: string }[]>([]);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    description: '',
  });
  const [manageForm, setManageForm] = useState({
    selectedFacilities: [] as string[],
    selectedTestAdmins: [] as string[],
    testAdminFacilities: {} as Record<string, string[]>,
  });

  useEffect(() => {
    // TODO: Fetch campaigns, facilities, and test admins from API
    const fetchData = async () => {
      setLoading(true);
      setTimeout(() => {
        setCampaigns([
          {
            id: '1',
            name: 'Reading Assessment Q1 2024',
            description: 'First quarter reading assessment campaign',
            status: 'active',
            facilities: ['Primary School A', 'Primary School B'],
            testAdmins: [
              { id: '1', name: 'John Doe', assignedFacilities: ['Primary School A'] },
            ],
            createdAt: '2024-01-01',
          },
        ]);
        setAvailableFacilities(['Primary School A', 'Primary School B', 'Primary School C']);
        setAvailableTestAdmins([
          { id: '1', name: 'John Doe' },
          { id: '2', name: 'Jane Smith' },
        ]);
        setLoading(false);
      }, 500);
    };
    void fetchData();
  }, []);

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit to API
    const campaign: Campaign = {
      id: String(campaigns.length + 1),
      name: newCampaign.name,
      description: newCampaign.description,
      status: 'active',
      facilities: [],
      testAdmins: [],
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCampaigns([...campaigns, campaign]);
    setShowCreateModal(false);
    setNewCampaign({ name: '', description: '' });
  };

  const handleManageCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setManageForm({
      selectedFacilities: campaign.facilities,
      selectedTestAdmins: campaign.testAdmins.map((ta) => ta.id),
      testAdminFacilities: campaign.testAdmins.reduce(
        (acc, ta) => ({ ...acc, [ta.id]: ta.assignedFacilities }),
        {}
      ),
    });
    setShowManageModal(true);
  };

  const handleSaveCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaign) return;
    // TODO: Submit to API
    const updatedCampaign: Campaign = {
      ...selectedCampaign,
      facilities: manageForm.selectedFacilities,
      testAdmins: manageForm.selectedTestAdmins.map((id) => ({
        id,
        name: availableTestAdmins.find((ta) => ta.id === id)?.name || 'Unknown',
        assignedFacilities: manageForm.testAdminFacilities[id] || [],
      })),
    };
    setCampaigns(campaigns.map((c) => (c.id === selectedCampaign.id ? updatedCampaign : c)));
    setShowManageModal(false);
    setSelectedCampaign(null);
  };

  const handleCloseCampaign = (id: string) => {
    if (window.confirm('Are you sure you want to close this campaign? No new submissions will be accepted.')) {
      // TODO: Submit to API
      setCampaigns(
        campaigns.map((c) => (c.id === id ? { ...c, status: 'closed' as const } : c))
      );
    }
  };

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
            <h1 className="h4 sm:h3 fw-bold text-dark mb-1 sm:mb-2">Manage Campaigns</h1>
            <p className="text-secondary text-sm sm:text-base">Create and manage assessment campaigns</p>
          </div>
          <Button className="w-100 w-sm-auto" icon={<i className="fas fa-plus"></i>} onClick={() => setShowCreateModal(true)}>
            Create Campaign
          </Button>
        </div>

        <div className="row g-2 sm:g-3 md:g-4">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="col-12 col-md-6">
              <Card>
                <div className="d-flex justify-content-between align-items-start mb-2 sm:mb-3">
                  <div className="flex-grow-1">
                    <h5 className="mb-1 text-sm sm:text-base">{campaign.name}</h5>
                    <p className="text-secondary mb-0 small text-xs sm:text-sm">{campaign.description}</p>
                  </div>
                  <span
                    className={`badge flex-shrink-0 ${campaign.status === 'active' ? 'bg-success' : 'bg-secondary'}`}
                  >
                    {campaign.status === 'active' ? 'Active' : 'Closed'}
                  </span>
                </div>
                <div className="mb-2">
                  <strong className="text-sm sm:text-base">Facilities:</strong>{' '}
                  {campaign.facilities.length > 0 ? (
                    <div className="d-flex flex-wrap gap-1 mt-1">
                      {campaign.facilities.map((facility, idx) => (
                        <span key={idx} className="badge bg-primary text-xs">
                          {facility}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-secondary text-sm">None</span>
                  )}
                </div>
                <div className="mb-3">
                  <strong className="text-sm sm:text-base">Test Admins:</strong>{' '}
                  {campaign.testAdmins.length > 0 ? (
                    <div className="mt-1">
                      {campaign.testAdmins.map((ta, idx) => (
                        <div key={idx} className="small text-xs sm:text-sm">
                          {ta.name} ({ta.assignedFacilities.length} facilities)
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-secondary text-sm">None</span>
                  )}
                </div>
                <div className="d-flex flex-column flex-sm-row gap-2">
                  <Button
                    size="sm"
                    className="w-100 w-sm-auto"
                    onClick={() => handleManageCampaign(campaign)}
                    disabled={campaign.status === 'closed'}
                  >
                    Manage
                  </Button>
                  {campaign.status === 'active' && (
                    <Button
                      variant="danger"
                      size="sm"
                      className="w-100 w-sm-auto"
                      onClick={() => handleCloseCampaign(campaign.id)}
                    >
                      Close Campaign
                    </Button>
                  )}
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Create Campaign Modal */}
        <Modal
          show={showCreateModal}
          onHide={() => setShowCreateModal(false)}
          title="Create New Campaign"
          footer={
            <>
              <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" form="createCampaignForm">
                Create Campaign
              </Button>
            </>
          }
        >
          <Form id="createCampaignForm" onSubmit={handleCreateCampaign}>
            <Form.Group className="mb-3">
              <Form.Label className="text-dark">Campaign Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter unique campaign name"
                value={newCampaign.name}
                onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-dark">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter campaign description"
                value={newCampaign.description}
                onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                required
              />
            </Form.Group>
          </Form>
        </Modal>

        {/* Manage Campaign Modal */}
        {selectedCampaign && (
          <Modal
            show={showManageModal}
            onHide={() => setShowManageModal(false)}
            title={`Manage: ${selectedCampaign.name}`}
            size="lg"
            footer={
              <>
                <Button variant="secondary" onClick={() => setShowManageModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" form="manageCampaignForm">
                  Save Changes
                </Button>
              </>
            }
          >
            <Form id="manageCampaignForm" onSubmit={handleSaveCampaign}>
              <Form.Group className="mb-3 sm:mb-4">
                <Form.Label className="text-dark fw-bold text-sm sm:text-base">Add Facilities</Form.Label>
                <div className="border rounded p-2 sm:p-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {availableFacilities.map((facility) => (
                    <Form.Check
                      key={facility}
                      type="checkbox"
                      label={<span className="text-sm sm:text-base">{facility}</span>}
                      checked={manageForm.selectedFacilities.includes(facility)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setManageForm({
                            ...manageForm,
                            selectedFacilities: [...manageForm.selectedFacilities, facility],
                          });
                        } else {
                          setManageForm({
                            ...manageForm,
                            selectedFacilities: manageForm.selectedFacilities.filter((f) => f !== facility),
                          });
                        }
                      }}
                    />
                  ))}
                </div>
              </Form.Group>

              <Form.Group className="mb-3 sm:mb-4">
                <Form.Label className="text-dark fw-bold text-sm sm:text-base">Add Test Admins</Form.Label>
                <div className="border rounded p-2 sm:p-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {availableTestAdmins.map((admin) => (
                    <div key={admin.id} className="mb-3">
                      <Form.Check
                        type="checkbox"
                        label={admin.name}
                        checked={manageForm.selectedTestAdmins.includes(admin.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setManageForm({
                              ...manageForm,
                              selectedTestAdmins: [...manageForm.selectedTestAdmins, admin.id],
                              testAdminFacilities: {
                                ...manageForm.testAdminFacilities,
                                [admin.id]: [],
                              },
                            });
                          } else {
                            const { [admin.id]: removed, ...rest } = manageForm.testAdminFacilities;
                            setManageForm({
                              ...manageForm,
                              selectedTestAdmins: manageForm.selectedTestAdmins.filter((id) => id !== admin.id),
                              testAdminFacilities: rest,
                            });
                          }
                        }}
                      />
                      {manageForm.selectedTestAdmins.includes(admin.id) && (
                        <div className="ms-4 mt-2">
                          <Form.Label className="small text-secondary">
                            Assign facilities for {admin.name}:
                          </Form.Label>
                          <div className="d-flex flex-wrap gap-2">
                            {manageForm.selectedFacilities.map((facility) => (
                              <Form.Check
                                key={facility}
                                type="checkbox"
                                label={facility}
                                checked={(manageForm.testAdminFacilities[admin.id] || []).includes(facility)}
                                onChange={(e) => {
                                  const currentFacilities = manageForm.testAdminFacilities[admin.id] || [];
                                  if (e.target.checked) {
                                    setManageForm({
                                      ...manageForm,
                                      testAdminFacilities: {
                                        ...manageForm.testAdminFacilities,
                                        [admin.id]: [...currentFacilities, facility],
                                      },
                                    });
                                  } else {
                                    setManageForm({
                                      ...manageForm,
                                      testAdminFacilities: {
                                        ...manageForm.testAdminFacilities,
                                        [admin.id]: currentFacilities.filter((f) => f !== facility),
                                      },
                                    });
                                  }
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Form.Group>
            </Form>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default ManageCampaignsPage;

