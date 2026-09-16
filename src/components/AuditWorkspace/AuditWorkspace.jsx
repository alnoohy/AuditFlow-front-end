import { useEffect, useRef, useState } from 'react';
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

const getSubmissionEvidence = (submissions = []) => {
  const statusMap = {
    'pending review': 'submitted',
    approved: 'approved',
    rejected: 'rejected',
    'changes requested': 'requested',
  };

  return submissions.map((submission, index) => {
    const evidencePath = submission.evidenceUrl
      ? submission.evidenceUrl
          .replace(/\\/g, '/')
          .replace(/^\/+/, '')
      : '';

    const storedName = evidencePath
      ? evidencePath.split('/').pop()
      : `Submission ${index + 1}`;

    const fileName = storedName.replace(/^\d+-/, '');

    const baseUrl =
      import.meta.env.VITE_BACK_END_SERVER_URL.replace(
        /\/$/,
        ''
      );

    return {
      id: `submission-${submission._id}`,
      name: fileName,
      code: `S-${String(index + 1).padStart(2, '0')}`,
      status:
        statusMap[submission.status] || 'submitted',
      version: '',
      date: submission.submittedAt
        ? new Date(
            submission.submittedAt
          ).toLocaleDateString()
        : 'Submitted',
      previewUrl: evidencePath
        ? encodeURI(`${baseUrl}/${evidencePath}`)
        : null,
      comment: submission.comments || '',
      submissionId: submission._id,
      isSubmission: true,
    };
  });
};

const startingEvidence = [];

const startingReview = {
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
};

const startingBalances = {
  glBalance: 0,
  supportingBalance: 0,
  threshold: 0,
};

const startingNotes = [];

const AuditWorkspace = () => {
  const { requestId } = useParams();

  const [auditRequest, setAuditRequest] =
    useState(null);

  const [evidence, setEvidence] =
    useState(startingEvidence);

  const [
    submissionEvidence,
    setSubmissionEvidence,
  ] = useState([]);

  const [
    selectedEvidenceId,
    setSelectedEvidenceId,
  ] = useState(null);

  const [evidenceSearch, setEvidenceSearch] =
    useState('');

  const [
    requestEvidenceName,
    setRequestEvidenceName,
  ] = useState('');

  const [review, setReview] =
    useState(startingReview);

  const [balances, setBalances] =
    useState(startingBalances);

  const [notes, setNotes] =
    useState(startingNotes);

  const [newNote, setNewNote] =
    useState('');

  const [message, setMessage] =
    useState('');

  const [lastSaved, setLastSaved] =
    useState('');

  const [
    workspaceReady,
    setWorkspaceReady,
  ] = useState(false);

  const [saving, setSaving] =
    useState(false);

  const [completed, setCompleted] =
    useState(false);

  const [completedAt, setCompletedAt] =
    useState(null);

  const skipFirstAutoSave =
    useRef(true);

  const allEvidence = [
    ...submissionEvidence,
    ...evidence,
  ];

  const selectedEvidence =
    allEvidence.find(
      (item) =>
        String(item.id) ===
        String(selectedEvidenceId)
    );

  const variance =
    Number(balances.glBalance || 0) -
    Number(
      balances.supportingBalance || 0
    );

  const absoluteVariance =
    Math.abs(variance);

  const varianceExceedsThreshold =
    Number(balances.threshold || 0) > 0 &&
    absoluteVariance >=
      Number(balances.threshold || 0);

  const createWorkspacePayload = (
    completedValue = completed,
    completedAtValue = completedAt,
    reviewValue = review
  ) => {
    return {
      review: reviewValue,

      balances: {
        glBalance: Number(
          balances.glBalance || 0
        ),

        supportingBalance: Number(
          balances.supportingBalance || 0
        ),

        threshold: Number(
          balances.threshold || 0
        ),
      },

      notes: notes.map((note) => ({
        noteId: note.id,
        author: note.author,
        text: note.text,
        date: note.date,
      })),

      evidence: evidence.map((item) => ({
        evidenceId: String(item.id),
        name: item.name,
        code: item.code,
        status: item.status,
        version: item.version,
        date: item.date,
      })),

      selectedEvidenceId:
        selectedEvidenceId
          ? String(selectedEvidenceId)
          : null,

      completed: completedValue,
      completedAt: completedAtValue,
    };
  };

  const saveWorkspace = async (
    completedValue = completed,
    completedAtValue = completedAt,
    statusValue = null,
    reviewValue = review
  ) => {
    try {
      setSaving(true);

      const workspace =
        createWorkspacePayload(
          completedValue,
          completedAtValue,
          reviewValue
        );

      const updateData = {
        workspace,
      };

      if (statusValue) {
        updateData.status =
          statusValue;
      }

      await auditRequestService.update(
        requestId,
        updateData
      );

      if (statusValue) {
        setAuditRequest(
          (currentRequest) => ({
            ...currentRequest,
            status: statusValue,
          })
        );
      }

      setLastSaved(
        new Date().toLocaleTimeString()
      );

      return true;
    } catch (error) {
      console.log(error);

      setMessage(
        'Could not save the workspace.'
      );

      return false;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const fetchAuditRequest =
      async () => {
        try {
          const requestData =
            await auditRequestService.show(
              requestId
            );

          setAuditRequest(
            requestData
          );

          const realEvidence =
            getSubmissionEvidence(
              requestData.submissions ||
                []
            );

          setSubmissionEvidence(
            realEvidence
          );

          const workspace =
            requestData.workspace;

          let savedEvidence = [];

          if (workspace) {
            if (workspace.review) {
              setReview({
                ...startingReview,
                ...workspace.review,
              });
            }

            if (
              workspace.balances
            ) {
              setBalances({
                ...startingBalances,
                ...workspace.balances,
              });
            }

            if (
              workspace.notes?.length >
              0
            ) {
              setNotes(
                workspace.notes.map(
                  (note) => ({
                    id: note.noteId,
                    author:
                      note.author,
                    text: note.text,
                    date: note.date,
                  })
                )
              );
            } else {
              setNotes([]);
            }

            savedEvidence = (
              workspace.evidence || []
            )
              .filter(
                (item) =>
                  ![
                    '1',
                    '2',
                    '3',
                    '4',
                    '5',
                  ].includes(
                    String(
                      item.evidenceId
                    )
                  )
              )
              .map((item) => ({
                id: String(
                  item.evidenceId
                ),
                name: item.name,
                code: item.code,
                status:
                  item.status,
                version:
                  item.version,
                date: item.date,
                previewUrl: null,
              }));

            setEvidence(
              savedEvidence
            );

            const savedSelectedId =
              workspace.selectedEvidenceId
                ? String(
                    workspace.selectedEvidenceId
                  )
                : null;

            const availableEvidence =
              [
                ...realEvidence,
                ...savedEvidence,
              ];

            const selectedStillExists =
              availableEvidence.some(
                (item) =>
                  String(
                    item.id
                  ) ===
                  savedSelectedId
              );

            if (
              savedSelectedId &&
              selectedStillExists
            ) {
              setSelectedEvidenceId(
                savedSelectedId
              );
            } else if (
              realEvidence.length > 0
            ) {
              setSelectedEvidenceId(
                realEvidence[0].id
              );
            } else if (
              savedEvidence.length > 0
            ) {
              setSelectedEvidenceId(
                savedEvidence[0].id
              );
            } else {
              setSelectedEvidenceId(
                null
              );
            }

            setCompleted(
              workspace.completed ||
                false
            );

            setCompletedAt(
              workspace.completedAt ||
                null
            );
          } else {
            setEvidence([]);
            setNotes([]);

            if (
              realEvidence.length > 0
            ) {
              setSelectedEvidenceId(
                realEvidence[0].id
              );
            } else {
              setSelectedEvidenceId(
                null
              );
            }
          }

          skipFirstAutoSave.current =
            true;

          setWorkspaceReady(true);
        } catch (error) {
          console.log(error);

          setMessage(
            'Could not load the audit workspace.'
          );
        }
      };

    fetchAuditRequest();
  }, [requestId]);

  useEffect(() => {
    if (!workspaceReady) {
      return;
    }

    if (
      skipFirstAutoSave.current
    ) {
      skipFirstAutoSave.current =
        false;

      return;
    }

    const timer = setTimeout(
      async () => {
        try {
          setSaving(true);

          const workspace =
            createWorkspacePayload();

          await auditRequestService.update(
            requestId,
            {
              workspace,
            }
          );

          setLastSaved(
            new Date().toLocaleTimeString()
          );
        } catch (error) {
          console.log(error);
        } finally {
          setSaving(false);
        }
      },
      3000
    );

    return () =>
      clearTimeout(timer);
  }, [
    review,
    balances,
    notes,
    evidence,
    selectedEvidenceId,
    workspaceReady,
  ]);

  const handleReviewChange = (
    event
  ) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setReview({
      ...review,
      [name]:
        type === 'checkbox'
          ? checked
          : value,
    });
  };

  const handleBalanceChange = (
    event
  ) => {
    const { name, value } =
      event.target;

    setBalances({
      ...balances,
      [name]: value,
    });
  };

  const handleFileUpload = (
    event
  ) => {
    const file =
      event.target.files[0];

    if (!file) {
      return;
    }

    const newEvidence = {
      id: String(Date.now()),

      name: file.name,

      code: `E-${String(
        evidence.length + 1
      ).padStart(2, '0')}`,

      status: 'submitted',

      version: 'v1',

      date:
        new Date().toLocaleDateString(),

      previewUrl:
        URL.createObjectURL(file),
    };

    setEvidence([
      ...evidence,
      newEvidence,
    ]);

    setSelectedEvidenceId(
      String(newEvidence.id)
    );

    setMessage(
      'Evidence added to the review desk.'
    );
  };

  const handleRequestEvidence =
    () => {
      if (
        !requestEvidenceName.trim()
      ) {
        setMessage(
          'Enter the evidence you want to request.'
        );

        return;
      }

      const newEvidence = {
        id: String(Date.now()),

        name:
          requestEvidenceName.trim(),

        code: `E-${String(
          evidence.length + 1
        ).padStart(2, '0')}`,

        status: 'requested',

        version: '',

        date: `Requested ${new Date().toLocaleDateString()}`,

        previewUrl: null,
      };

      setEvidence([
        ...evidence,
        newEvidence,
      ]);

      setSelectedEvidenceId(
        String(newEvidence.id)
      );

      setRequestEvidenceName('');

      setMessage(
        'New evidence request added.'
      );
    };

  const createFindingFromException =
    () => {
      const evidenceName =
        selectedEvidence?.name ||
        'selected evidence';

      const findingText =
        `An exception was identified while reviewing ${evidenceName}. ` +
        `The recorded balance differs from the supporting balance by ` +
        `BHD ${absoluteVariance.toLocaleString()}.`;

      setReview({
        ...review,
        result: 'exception',
        finding: findingText,
      });

      setMessage(
        'Finding created from the identified exception.'
      );
    };

  const addNote = () => {
    if (!newNote.trim()) {
      setMessage(
        'Enter a review note first.'
      );

      return;
    }

    const note = {
      id: Date.now(),
      author: 'Auditor',
      text: newNote.trim(),
      date:
        new Date().toLocaleString(),
    };

    setNotes([
      note,
      ...notes,
    ]);

    setNewNote('');

    setMessage(
      'Review note added.'
    );
  };

  const saveDraft = async () => {
    const saved =
      await saveWorkspace();

    if (saved) {
      setMessage(
        'Draft saved to AuditFlow.'
      );
    }
  };

  const requestMoreEvidence =
    async () => {
      const updatedReview = {
        ...review,
        result: 'more-evidence',
      };

      setReview(updatedReview);

      const saved =
        await saveWorkspace(
          false,
          null,
          'pending',
          updatedReview
        );

      if (saved) {
        setCompleted(false);
        setCompletedAt(null);

        setMessage(
          'More evidence requested. The audit request is now pending.'
        );
      }
    };

  const completeWorkpaper =
    async () => {
      if (
        !review.procedure.trim()
      ) {
        setMessage(
          'Add the audit procedure before completing the workpaper.'
        );

        return;
      }

      if (!review.result) {
        setMessage(
          'Select a test result before completing the workpaper.'
        );

        return;
      }

      if (
        review.result ===
        'more-evidence'
      ) {
        setMessage(
          'Additional evidence is required before completing the workpaper.'
        );

        return;
      }

      if (
        !review.conclusion.trim()
      ) {
        setMessage(
          'Add the auditor conclusion before completing the workpaper.'
        );

        return;
      }

      if (
        review.result ===
          'exception' &&
        !review.finding.trim()
      ) {
        setMessage(
          'Document the finding before completing the workpaper.'
        );

        return;
      }

      const completionTime =
        new Date().toISOString();

      const saved =
        await saveWorkspace(
          true,
          completionTime,
          'completed'
        );

      if (saved) {
        setCompleted(true);

        setCompletedAt(
          completionTime
        );

        setMessage(
          'Workpaper completed and saved successfully.'
        );
      }
    };

  const filteredEvidence =
    allEvidence.filter((item) =>
      item.name
        .toLowerCase()
        .includes(
          evidenceSearch.toLowerCase()
        )
    );

  const getStatusIcon = (
    status
  ) => {
    if (status === 'approved') {
      return (
        <CheckCircle2 size={16} />
      );
    }

    if (status === 'rejected') {
      return (
        <XCircle size={16} />
      );
    }

    if (status === 'requested') {
      return (
        <AlertTriangle size={16} />
      );
    }

    return (
      <FileText size={16} />
    );
  };

  if (!auditRequest) {
    return (
      <p className="trace-loading">
        Loading audit workspace...
      </p>
    );
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
            <h1>
              {auditRequest.title}
            </h1>

            <span className="trace-priority">
              {auditRequest.priority}{' '}
              priority
            </span>
          </div>

          <div className="trace-meta">
            <span>
              Department:{' '}
              {auditRequest.department
                ?.name ||
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
              Status:{' '}
              {auditRequest.status}
            </span>

            <span>
              Assigned:{' '}
              {auditRequest.assignedTo
                ?.username ||
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
            onClick={() =>
              setMessage('')
            }
          >
            ×
          </button>
        </div>
      )}

      <div className="trace-desk">
        <aside className="evidence-panel">
          <div className="panel-heading">
            <div>
              <span>
                Client PBC
              </span>

              <h2>Evidence</h2>
            </div>

            <label className="upload-evidence-btn">
              <Upload size={15} />
              Upload

              <input
                type="file"
                accept=".pdf,.xlsx,.xls,.csv,.doc,.docx"
                onChange={
                  handleFileUpload
                }
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
                setEvidenceSearch(
                  event.target.value
                )
              }
            />
          </div>

          <div className="evidence-list">
            {filteredEvidence.length >
            0 ? (
              filteredEvidence.map(
                (item) => (
                  <button
                    type="button"
                    key={item.id}
                    className={
                      String(
                        selectedEvidenceId
                      ) ===
                      String(item.id)
                        ? 'evidence-item selected'
                        : 'evidence-item'
                    }
                    onClick={() =>
                      setSelectedEvidenceId(
                        String(
                          item.id
                        )
                      )
                    }
                  >
                    <div
                      className={`evidence-file-icon ${item.status}`}
                    >
                      {getStatusIcon(
                        item.status
                      )}
                    </div>

                    <div className="evidence-item-info">
                      <strong>
                        {item.code}{' '}
                        {item.name}
                      </strong>

                      <span>
                        {item.version &&
                          `${item.version} • `}

                        {item.date}
                      </span>

                      <small
                        className={`evidence-status ${item.status}`}
                      >
                        {item.status}
                      </small>
                    </div>
                  </button>
                )
              )
            ) : (
              <p className="trace-loading">
                No evidence submitted
                yet.
              </p>
            )}
          </div>

          <div className="request-evidence-box">
            <h3>
              Request Evidence
            </h3>

            <input
              type="text"
              placeholder="Example: Manager Approval"
              value={
                requestEvidenceName
              }
              onChange={(event) =>
                setRequestEvidenceName(
                  event.target.value
                )
              }
            />

            <button
              type="button"
              onClick={
                handleRequestEvidence
              }
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
                <FileText
                  size={18}
                />

                <strong>
                  {selectedEvidence
                    ? `${selectedEvidence.code} ${selectedEvidence.name}`
                    : 'No evidence selected'}
                </strong>
              </div>

              <span>
                {
                  selectedEvidence?.status
                }
              </span>
            </div>

            {selectedEvidence?.comment && (
              <div className="evidence-note">
                <strong>
                  Employee Comment
                </strong>

                <p>
                  {
                    selectedEvidence.comment
                  }
                </p>
              </div>
            )}

            <div className="document-canvas">
              {selectedEvidence
                ?.previewUrl &&
              selectedEvidence.name
                .toLowerCase()
                .endsWith(
                  '.pdf'
                ) ? (
                <iframe
                  src={
                    selectedEvidence.previewUrl
                  }
                  title="Evidence preview"
                  className="evidence-pdf-preview"
                />
              ) : selectedEvidence ? (
                <div className="document-paper">
                  <div className="document-logo">
                    AuditFlow Evidence
                    Review
                  </div>

                  <h3>
                    {
                      selectedEvidence.name
                    }
                  </h3>

                  <p>
                    Evidence reference:{' '}
                    {
                      selectedEvidence.code
                    }
                  </p>

                  {selectedEvidence.comment && (
                    <p>
                      Employee
                      comment:{' '}
                      {
                        selectedEvidence.comment
                      }
                    </p>
                  )}

                  <div className="document-line" />

                  <div className="document-line short" />

                  <div className="document-line" />

                  <p className="preview-note">
                    PDF evidence can
                    be previewed
                    directly here.
                  </p>
                </div>
              ) : (
                <div className="document-paper">
                  <div className="document-logo">
                    AuditFlow Evidence
                    Review
                  </div>

                  <h3>
                    No evidence
                    selected
                  </h3>

                  <p>
                    Employee
                    submissions will
                    appear in the
                    Evidence panel.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="workpaper-editor">
            <div className="workpaper-title">
              <div>
                <span>
                  WORKPAPER WP-01
                </span>

                <h2>
                  Audit Test
                </h2>
              </div>

              <FileCheck2
                size={21}
              />
            </div>

            <div className="workpaper-field">
              <label>
                1. Audit Objective
              </label>

              <textarea
                name="objective"
                value={
                  review.objective
                }
                onChange={
                  handleReviewChange
                }
              />
            </div>

            <div className="workpaper-field">
              <label>
                2. Procedure
                Performed
              </label>

              <textarea
                name="procedure"
                value={
                  review.procedure
                }
                placeholder="Describe what you tested and how you performed the review..."
                onChange={
                  handleReviewChange
                }
              />
            </div>

            <div className="linked-evidence">
              <label>
                3. Evidence Used
              </label>

              <div>
                <span>
                  <FileText
                    size={14}
                  />

                  {selectedEvidence
                    ? `${selectedEvidence.code} ${selectedEvidence.name}`
                    : 'No evidence selected'}
                </span>
              </div>
            </div>

            <div className="workpaper-field">
              <label>
                4. Test Result
              </label>

              <div className="result-options">
                <label>
                  <input
                    type="radio"
                    name="result"
                    value="pass"
                    checked={
                      review.result ===
                      'pass'
                    }
                    onChange={
                      handleReviewChange
                    }
                  />

                  Pass
                </label>

                <label>
                  <input
                    type="radio"
                    name="result"
                    value="exception"
                    checked={
                      review.result ===
                      'exception'
                    }
                    onChange={
                      handleReviewChange
                    }
                  />

                  Exception Found
                </label>

                <label>
                  <input
                    type="radio"
                    name="result"
                    value="more-evidence"
                    checked={
                      review.result ===
                      'more-evidence'
                    }
                    onChange={
                      handleReviewChange
                    }
                  />

                  More Evidence
                  Required
                </label>
              </div>
            </div>

            {review.result ===
              'exception' && (
              <div className="finding-editor">
                <div>
                  <AlertTriangle
                    size={17}
                  />

                  <strong>
                    Exception
                    identified
                  </strong>
                </div>

                <label>
                  Finding
                </label>

                <textarea
                  name="finding"
                  value={
                    review.finding
                  }
                  placeholder="Document the exception identified during testing..."
                  onChange={
                    handleReviewChange
                  }
                />
              </div>
            )}

            <div className="workpaper-field">
              <label>
                5. Auditor
                Conclusion
              </label>

              <textarea
                name="conclusion"
                value={
                  review.conclusion
                }
                placeholder="Summarize your conclusion from this test..."
                onChange={
                  handleReviewChange
                }
              />
            </div>
          </div>
        </section>

        <aside className="review-panel">
          <div className="review-card">
            <div className="review-card-title">
              <FileCheck2
                size={18}
              />

              <h2>
                Evidence Review
              </h2>
            </div>

            <label className="quality-check">
              <input
                type="checkbox"
                name="relevant"
                checked={
                  review.relevant
                }
                onChange={
                  handleReviewChange
                }
              />

              <div>
                <strong>
                  Relevant
                </strong>

                <span>
                  Supports the audit
                  objective
                </span>
              </div>
            </label>

            <label className="quality-check">
              <input
                type="checkbox"
                name="reliable"
                checked={
                  review.reliable
                }
                onChange={
                  handleReviewChange
                }
              />

              <div>
                <strong>
                  Reliable
                </strong>

                <span>
                  Comes from a trusted
                  source
                </span>
              </div>
            </label>

            <label className="quality-check">
              <input
                type="checkbox"
                name="sufficient"
                checked={
                  review.sufficient
                }
                onChange={
                  handleReviewChange
                }
              />

              <div>
                <strong>
                  Sufficient
                </strong>

                <span>
                  Enough to support
                  the conclusion
                </span>
              </div>
            </label>

            <div className="evidence-note">
              <label>
                Notes on Evidence
              </label>

              <textarea
                name="evidenceNote"
                value={
                  review.evidenceNote
                }
                placeholder="Record observations about this evidence..."
                onChange={
                  handleReviewChange
                }
              />
            </div>
          </div>

          <div className="review-card">
            <div className="review-card-title">
              <Calculator
                size={18}
              />

              <h2>
                Variance Test
              </h2>
            </div>

            <div className="variance-input-row">
              <label>
                GL Balance
              </label>

              <input
                type="number"
                name="glBalance"
                value={
                  balances.glBalance
                }
                onChange={
                  handleBalanceChange
                }
              />
            </div>

            <div className="variance-input-row">
              <label>
                Supporting Balance
              </label>

              <input
                type="number"
                name="supportingBalance"
                value={
                  balances.supportingBalance
                }
                onChange={
                  handleBalanceChange
                }
              />
            </div>

            <div className="variance-input-row">
              <label>
                Review Threshold
              </label>

              <input
                type="number"
                name="threshold"
                value={
                  balances.threshold
                }
                onChange={
                  handleBalanceChange
                }
              />
            </div>

            <div className="variance-result">
              <span>
                Variance
              </span>

              <strong>
                BHD{' '}
                {absoluteVariance.toLocaleString()}
              </strong>
            </div>

            <p className="variance-formula">
              {Number(
                balances.glBalance ||
                  0
              ).toLocaleString()}

              {' - '}

              {Number(
                balances.supportingBalance ||
                  0
              ).toLocaleString()}

              {' = '}

              {variance.toLocaleString()}
            </p>

            {varianceExceedsThreshold && (
              <div className="variance-warning">
                <AlertTriangle
                  size={17}
                />

                <div>
                  <strong>
                    Variance exceeds
                    threshold
                  </strong>

                  <span>
                    This item should
                    be investigated.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={
                    createFindingFromException
                  }
                >
                  Create Finding
                </button>
              </div>
            )}
          </div>

          <div className="review-card">
            <div className="review-card-title notes-heading">
              <div>
                <MessageSquare
                  size={18}
                />

                <h2>
                  Review Notes
                </h2>
              </div>
            </div>

            <div className="add-note">
              <textarea
                placeholder="Add a review note..."
                value={newNote}
                onChange={(event) =>
                  setNewNote(
                    event.target.value
                  )
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
              {notes.map(
                (note) => (
                  <article
                    className="review-note"
                    key={note.id}
                  >
                    <div>
                      <strong>
                        {note.author}
                      </strong>

                      <span>
                        {note.date}
                      </span>
                    </div>

                    <p>
                      {note.text}
                    </p>
                  </article>
                )
              )}
            </div>
          </div>
        </aside>
      </div>

      <footer className="workspace-action-bar">
        <div className="autosave-status">
          <CheckCircle2
            size={16}
          />

          {saving
            ? 'Saving...'
            : lastSaved
              ? `Auto-saved at ${lastSaved}`
              : completed
                ? 'Workpaper completed'
                : 'Auto-save active'}
        </div>

        <div className="workspace-actions">
          <button
            type="button"
            className="save-draft-btn"
            onClick={saveDraft}
            disabled={saving}
          >
            <Save size={16} />
            Save Draft
          </button>

          <button
            type="button"
            className="request-more-btn"
            onClick={
              requestMoreEvidence
            }
            disabled={saving}
          >
            <Send size={16} />
            Request More Evidence
          </button>

          <button
            type="button"
            className="complete-workpaper-btn"
            onClick={
              completeWorkpaper
            }
            disabled={
              saving || completed
            }
          >
            <Check size={17} />

            {completed
              ? 'Workpaper Completed'
              : 'Complete Workpaper'}
          </button>
        </div>
      </footer>
    </main>
  );
};

export default AuditWorkspace;