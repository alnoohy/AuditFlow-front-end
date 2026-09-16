import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';

import {
  AlertTriangle,
  ArrowLeft,
  Calculator,
  Check,
  CheckCircle2,
  FileCheck2,
  FileText,
  MessageSquare,
  Plus,
  Save,
  Search,
  Send,
  Upload,
  XCircle,
} from 'lucide-react';

import * as auditRequestService from '../../services/auditRequestService';

import './AuditWorkspace.css';

const startingEvidence = [
  {
    id: 1,
    name: 'Bank Statement.pdf',
    code: 'E-01',
    status: 'approved',
    version: 'v2',
    date: '12 Sep 2026',
    previewUrl: null,
  },
  {
    id: 2,
    name: 'Receivables Aging.xlsx',
    code: 'E-02',
    status: 'approved',
    version: 'v1',
    date: '10 Sep 2026',
    previewUrl: null,
  },
  {
    id: 3,
    name: 'Inventory Report.pdf',
    code: 'E-03',
    status: 'submitted',
    version: 'v1',
    date: '8 Sep 2026',
    previewUrl: null,
  },
  {
    id: 4,
    name: 'Management Approval.pdf',
    code: 'E-04',
    status: 'requested',
    version: '',
    date: 'Requested 5 Sep 2026',
    previewUrl: null,
  },
  {
    id: 5,
    name: 'AP Aging.xlsx',
    code: 'E-05',
    status: 'rejected',
    version: 'v1',
    date: '4 Sep 2026',
    previewUrl: null,
  },
];

const AuditWorkspace = () => {
  const { requestId } = useParams();

  const [auditRequest, setAuditRequest] = useState(null);

  const [evidence, setEvidence] = useState(startingEvidence);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState(3);
  const [evidenceSearch, setEvidenceSearch] = useState('');
  const [requestEvidenceName, setRequestEvidenceName] = useState('');

  const [review, setReview] = useState({
    relevant: true,
    reliable: true,
    sufficient: false,
    objective:
      'Verify that the submitted information agrees with the supporting documentation.',
    procedure: '',
    result: '',
    evidenceNote: '',
    finding: '',
    conclusion: '',
  });

  const [balances, setBalances] = useState({
    glBalance: 32400,
    supportingBalance: 31200,
    threshold: 500,
  });

  const [notes, setNotes] = useState([
    {
      id: 1,
      author: 'Auditor',
      text: 'Variance identified in the supporting records. Follow-up required.',
      date: 'Today',
    },
  ]);

  const [newNote, setNewNote] = useState('');
  const [message, setMessage] = useState('');
  const [lastSaved, setLastSaved] = useState('');
  const [storageReady, setStorageReady] = useState(false);

  const selectedEvidence = evidence.find(
    (item) => item.id === selectedEvidenceId
  );

  const variance =
    Number(balances.glBalance || 0) -
    Number(balances.supportingBalance || 0);

  const absoluteVariance = Math.abs(variance);

  const varianceExceedsThreshold =
    absoluteVariance >= Number(balances.threshold || 0);

  useEffect(() => {
    const fetchAuditRequest = async () => {
      try {
        const requestData = await auditRequestService.show(requestId);
        setAuditRequest(requestData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAuditRequest();
  }, [requestId]);

  useEffect(() => {
    const savedWorkspace = localStorage.getItem(
      `audit-workspace-${requestId}`
    );

    if (savedWorkspace) {
      try {
        const savedData = JSON.parse(savedWorkspace);

        if (savedData.review) {
          setReview(savedData.review);
        }

        if (savedData.balances) {
          setBalances(savedData.balances);
        }

        if (savedData.notes) {
          setNotes(savedData.notes);
        }

        if (savedData.evidence) {
          setEvidence(savedData.evidence);
        }

        if (savedData.selectedEvidenceId) {
          setSelectedEvidenceId(savedData.selectedEvidenceId);
        }
      } catch (error) {
        console.log(error);
      }
    }

    setStorageReady(true);
  }, [requestId]);

  useEffect(() => {
    if (!storageReady) {
      return;
    }

    const timer = setTimeout(() => {
      const evidenceToSave = evidence.map((item) => ({
        ...item,
        previewUrl: null,
      }));

      localStorage.setItem(
        `audit-workspace-${requestId}`,
        JSON.stringify({
          review,
          balances,
          notes,
          evidence: evidenceToSave,
          selectedEvidenceId,
        })
      );

      setLastSaved(new Date().toLocaleTimeString());
    }, 700);

    return () => clearTimeout(timer);
  }, [
    review,
    balances,
    notes,
    evidence,
    selectedEvidenceId,
    requestId,
    storageReady,
  ]);

  const handleReviewChange = (event) => {
    const { name, value, type, checked } = event.target;

    setReview({
      ...review,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleBalanceChange = (event) => {
    const { name, value } = event.target;

    setBalances({
      ...balances,
      [name]: value,
    });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const newEvidence = {
      id: Date.now(),
      name: file.name,
      code: `E-${String(evidence.length + 1).padStart(2, '0')}`,
      status: 'submitted',
      version: 'v1',
      date: new Date().toLocaleDateString(),
      previewUrl: URL.createObjectURL(file),
    };

    setEvidence([...evidence, newEvidence]);
    setSelectedEvidenceId(newEvidence.id);

    setMessage('Evidence added to the review desk.');
  };

  const handleRequestEvidence = () => {
    if (!requestEvidenceName.trim()) {
      return;
    }

    const newEvidence = {
      id: Date.now(),
      name: requestEvidenceName,
      code: `E-${String(evidence.length + 1).padStart(2, '0')}`,
      status: 'requested',
      version: '',
      date: `Requested ${new Date().toLocaleDateString()}`,
      previewUrl: null,
    };

    setEvidence([...evidence, newEvidence]);
    setRequestEvidenceName('');

    setMessage('New evidence request added.');
  };

  const createFindingFromException = () => {
    const evidenceName =
      selectedEvidence?.name || 'selected evidence';

    const findingText =
      `An exception was identified while reviewing ${evidenceName}. ` +
      `The recorded balance differs from the supporting balance by ` +
      `BHD ${absoluteVariance.toLocaleString()}.`;

    setReview({
      ...review,
      result: 'exception',
      finding: findingText,
    });

    setMessage('Finding created from the identified exception.');
  };

  const addNote = () => {
    if (!newNote.trim()) {
      return;
    }

    const note = {
      id: Date.now(),
      author: 'Auditor',
      text: newNote,
      date: new Date().toLocaleString(),
    };

    setNotes([note, ...notes]);
    setNewNote('');
  };

  const saveDraft = () => {
    const evidenceToSave = evidence.map((item) => ({
      ...item,
      previewUrl: null,
    }));

    localStorage.setItem(
      `audit-workspace-${requestId}`,
      JSON.stringify({
        review,
        balances,
        notes,
        evidence: evidenceToSave,
        selectedEvidenceId,
      })
    );

    setLastSaved(new Date().toLocaleTimeString());
    setMessage('Draft saved.');
  };

  const completeWorkpaper = () => {
    if (!review.procedure.trim()) {
      setMessage('Add the audit procedure before completing the workpaper.');
      return;
    }

    if (!review.result) {
      setMessage('Select a test result before completing the workpaper.');
      return;
    }

    if (!review.conclusion.trim()) {
      setMessage('Add the auditor conclusion before completing the workpaper.');
      return;
    }

    if (review.result === 'exception' && !review.finding.trim()) {
      setMessage('Document the finding before completing the workpaper.');
      return;
    }

    setMessage('Workpaper is complete and ready for review.');
  };

  const filteredEvidence = evidence.filter((item) =>
    item.name.toLowerCase().includes(evidenceSearch.toLowerCase())
  );

  const getStatusIcon = (status) => {
    if (status === 'approved') {
      return <CheckCircle2 size={16} />;
    }

    if (status === 'rejected') {
      return <XCircle size={16} />;
    }

    if (status === 'requested') {
      return <AlertTriangle size={16} />;
    }

    return <FileText size={16} />;
  };

  if (!auditRequest) {
    return <p className="trace-loading">Loading audit workspace...</p>;
  }

  return (
    <main className="trace-workspace">

      <header className="trace-header">

        <div>
          <Link
            to={`/audit-requests/${requestId}`}
            className="trace-back"
          >
            <ArrowLeft size={16} />
            Audit Request
          </Link>

          <div className="trace-title-row">
            <h1>{auditRequest.title}</h1>

            <span className="trace-priority">
              {auditRequest.priority} priority
            </span>
          </div>

          <div className="trace-meta">
            <span>
              Department:{' '}
              {auditRequest.department?.name ||
                auditRequest.department ||
                'Not assigned'}
            </span>

            <span>
              Due:{' '}
              {auditRequest.deadline
                ? new Date(
                    auditRequest.deadline
                  ).toLocaleDateString()
                : 'No deadline'}
            </span>

            <span>
              Status: {auditRequest.status}
            </span>

            <span>
              Assigned:{' '}
              {auditRequest.assignedTo?.username ||
                'Not assigned'}
            </span>
          </div>
        </div>

        <Link
          to={`/audit-requests/${requestId}`}
          className="trace-details-btn"
        >
          View Request Details
        </Link>

      </header>

      {message && (
        <div className="trace-message">
          <Check size={16} />
          {message}

          <button
            type="button"
            onClick={() => setMessage('')}
          >
            ×
          </button>
        </div>
      )}

      <div className="trace-desk">

        <aside className="evidence-panel">

          <div className="panel-heading">
            <div>
              <span>Client PBC</span>
              <h2>Evidence</h2>
            </div>

            <label className="upload-evidence-btn">
              <Upload size={15} />
              Upload

              <input
                type="file"
                accept=".pdf,.xlsx,.xls,.csv,.doc,.docx"
                onChange={handleFileUpload}
              />
            </label>
          </div>

          <div className="evidence-search">
            <Search size={15} />

            <input
              type="text"
              placeholder="Search evidence..."
              value={evidenceSearch}
              onChange={(event) =>
                setEvidenceSearch(event.target.value)
              }
            />
          </div>

          <div className="evidence-list">

            {filteredEvidence.map((item) => (
              <button
                type="button"
                key={item.id}
                className={
                  selectedEvidenceId === item.id
                    ? 'evidence-item selected'
                    : 'evidence-item'
                }
                onClick={() =>
                  setSelectedEvidenceId(item.id)
                }
              >
                <div
                  className={`evidence-file-icon ${item.status}`}
                >
                  {getStatusIcon(item.status)}
                </div>

                <div className="evidence-item-info">
                  <strong>
                    {item.code} {item.name}
                  </strong>

                  <span>
                    {item.version && `${item.version} • `}
                    {item.date}
                  </span>

                  <small className={`evidence-status ${item.status}`}>
                    {item.status}
                  </small>
                </div>
              </button>
            ))}

          </div>

          <div className="request-evidence-box">
            <h3>Request Evidence</h3>

            <input
              type="text"
              placeholder="Example: Manager Approval"
              value={requestEvidenceName}
              onChange={(event) =>
                setRequestEvidenceName(event.target.value)
              }
            />

            <button
              type="button"
              onClick={handleRequestEvidence}
            >
              <Send size={15} />
              Add Request
            </button>
          </div>

        </aside>

        <section className="workpaper-center">

          <div className="document-viewer">

            <div className="document-viewer-header">
              <div>
                <FileText size={18} />

                <strong>
                  {selectedEvidence?.code}{' '}
                  {selectedEvidence?.name}
                </strong>
              </div>

              <span>
                {selectedEvidence?.status}
              </span>
            </div>

            <div className="document-canvas">

              {selectedEvidence?.previewUrl &&
              selectedEvidence.name
                .toLowerCase()
                .endsWith('.pdf') ? (
                <iframe
                  src={selectedEvidence.previewUrl}
                  title="Evidence preview"
                  className="evidence-pdf-preview"
                />
              ) : (
                <div className="document-paper">

                  <div className="document-logo">
                    AuditFlow Evidence Review
                  </div>

                  <h3>
                    {selectedEvidence?.name}
                  </h3>

                  <p>
                    Evidence reference:{' '}
                    {selectedEvidence?.code}
                  </p>

                  <div className="document-line" />
                  <div className="document-line short" />
                  <div className="document-line" />

                  <div className="document-table-preview">
                    <div>Reference</div>
                    <div>Supporting Amount</div>

                    <div>Record 01</div>
                    <div>BHD 12,400.000</div>

                    <div>Record 02</div>
                    <div>BHD 9,600.000</div>

                    <div>Record 03</div>
                    <div>BHD 9,200.000</div>
                  </div>

                  <p className="preview-note">
                    Upload a PDF from the Evidence panel to preview
                    the actual file here.
                  </p>

                </div>
              )}

            </div>

          </div>

          <div className="workpaper-editor">

            <div className="workpaper-title">
              <div>
                <span>WORKPAPER WP-01</span>
                <h2>Audit Test</h2>
              </div>

              <FileCheck2 size={21} />
            </div>

            <div className="workpaper-field">
              <label>1. Audit Objective</label>

              <textarea
                name="objective"
                value={review.objective}
                onChange={handleReviewChange}
              />
            </div>

            <div className="workpaper-field">
              <label>2. Procedure Performed</label>

              <textarea
                name="procedure"
                value={review.procedure}
                placeholder="Describe what you tested and how you performed the review..."
                onChange={handleReviewChange}
              />
            </div>

            <div className="linked-evidence">
              <label>3. Evidence Used</label>

              <div>
                <span>
                  <FileText size={14} />
                  {selectedEvidence?.code}{' '}
                  {selectedEvidence?.name}
                </span>
              </div>
            </div>

            <div className="workpaper-field">
              <label>4. Test Result</label>

              <div className="result-options">

                <label>
                  <input
                    type="radio"
                    name="result"
                    value="pass"
                    checked={review.result === 'pass'}
                    onChange={handleReviewChange}
                  />
                  Pass
                </label>

                <label>
                  <input
                    type="radio"
                    name="result"
                    value="exception"
                    checked={review.result === 'exception'}
                    onChange={handleReviewChange}
                  />
                  Exception Found
                </label>

                <label>
                  <input
                    type="radio"
                    name="result"
                    value="more-evidence"
                    checked={review.result === 'more-evidence'}
                    onChange={handleReviewChange}
                  />
                  More Evidence Required
                </label>

              </div>
            </div>

            {review.result === 'exception' && (
              <div className="finding-editor">

                <div>
                  <AlertTriangle size={17} />

                  <strong>Exception identified</strong>
                </div>

                <label>Finding</label>

                <textarea
                  name="finding"
                  value={review.finding}
                  placeholder="Document the exception identified during testing..."
                  onChange={handleReviewChange}
                />

              </div>
            )}

            <div className="workpaper-field">
              <label>5. Auditor Conclusion</label>

              <textarea
                name="conclusion"
                value={review.conclusion}
                placeholder="Summarize your conclusion from this test..."
                onChange={handleReviewChange}
              />
            </div>

          </div>

        </section>

        <aside className="review-panel">

          <div className="review-card">

            <div className="review-card-title">
              <FileCheck2 size={18} />
              <h2>Evidence Review</h2>
            </div>

            <label className="quality-check">
              <input
                type="checkbox"
                name="relevant"
                checked={review.relevant}
                onChange={handleReviewChange}
              />

              <div>
                <strong>Relevant</strong>
                <span>Supports the audit objective</span>
              </div>
            </label>

            <label className="quality-check">
              <input
                type="checkbox"
                name="reliable"
                checked={review.reliable}
                onChange={handleReviewChange}
              />

              <div>
                <strong>Reliable</strong>
                <span>Comes from a trusted source</span>
              </div>
            </label>

            <label className="quality-check">
              <input
                type="checkbox"
                name="sufficient"
                checked={review.sufficient}
                onChange={handleReviewChange}
              />

              <div>
                <strong>Sufficient</strong>
                <span>Enough to support the conclusion</span>
              </div>
            </label>

            <div className="evidence-note">
              <label>Notes on Evidence</label>

              <textarea
                name="evidenceNote"
                value={review.evidenceNote}
                placeholder="Record observations about this evidence..."
                onChange={handleReviewChange}
              />
            </div>

          </div>

          <div className="review-card">

            <div className="review-card-title">
              <Calculator size={18} />
              <h2>Variance Test</h2>
            </div>

            <div className="variance-input-row">
              <label>GL Balance</label>

              <input
                type="number"
                name="glBalance"
                value={balances.glBalance}
                onChange={handleBalanceChange}
              />
            </div>

            <div className="variance-input-row">
              <label>Supporting Balance</label>

              <input
                type="number"
                name="supportingBalance"
                value={balances.supportingBalance}
                onChange={handleBalanceChange}
              />
            </div>

            <div className="variance-input-row">
              <label>Review Threshold</label>

              <input
                type="number"
                name="threshold"
                value={balances.threshold}
                onChange={handleBalanceChange}
              />
            </div>

            <div className="variance-result">
              <span>Variance</span>

              <strong>
                BHD {absoluteVariance.toLocaleString()}
              </strong>
            </div>

            <p className="variance-formula">
              {Number(balances.glBalance || 0).toLocaleString()}
              {' - '}
              {Number(
                balances.supportingBalance || 0
              ).toLocaleString()}
              {' = '}
              {variance.toLocaleString()}
            </p>

            {varianceExceedsThreshold && (
              <div className="variance-warning">
                <AlertTriangle size={17} />

                <div>
                  <strong>
                    Variance exceeds threshold
                  </strong>

                  <span>
                    This item should be investigated.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={createFindingFromException}
                >
                  Create Finding
                </button>
              </div>
            )}

          </div>

          <div className="review-card">

            <div className="review-card-title notes-heading">
              <div>
                <MessageSquare size={18} />
                <h2>Review Notes</h2>
              </div>
            </div>

            <div className="add-note">
              <textarea
                placeholder="Add a review note..."
                value={newNote}
                onChange={(event) =>
                  setNewNote(event.target.value)
                }
              />

              <button
                type="button"
                onClick={addNote}
              >
                <Plus size={14} />
                Add Note
              </button>
            </div>

            <div className="review-notes-list">

              {notes.map((note) => (
                <article
                  className="review-note"
                  key={note.id}
                >
                  <div>
                    <strong>{note.author}</strong>
                    <span>{note.date}</span>
                  </div>

                  <p>{note.text}</p>
                </article>
              ))}

            </div>

          </div>

        </aside>

      </div>

      <footer className="workspace-action-bar">

        <div className="autosave-status">
          <CheckCircle2 size={16} />

          {lastSaved
            ? `Auto-saved at ${lastSaved}`
            : 'Auto-save active'}
        </div>

        <div className="workspace-actions">

          <button
            type="button"
            className="save-draft-btn"
            onClick={saveDraft}
          >
            <Save size={16} />
            Save Draft
          </button>

          <button
            type="button"
            className="request-more-btn"
            onClick={() =>
              setMessage(
                'Add the required document in the Evidence Request box.'
              )
            }
          >
            <Send size={16} />
            Request More Evidence
          </button>

          <button
            type="button"
            className="complete-workpaper-btn"
            onClick={completeWorkpaper}
          >
            <Check size={17} />
            Complete Workpaper
          </button>

        </div>

      </footer>

    </main>
  );
};

export default AuditWorkspace;