import React, { useState, useRef } from 'react';
import {
  Plus,
  Trash2,
  Check,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  User,
  Code,
  GripVertical
} from 'lucide-react';
import StatusTick from './StatusTick';
import { samplePresets } from '../data/defaultChatConfig';

export default function ConfigPanel({
  config,
  onChangeConfig,
  onSaveConfig,
  saveToast = false,
}) {
  const [activeTab, setActiveTab] = useState('messages'); // 'contact' | 'messages' | 'json'
  const [jsonText, setJsonText] = useState(JSON.stringify(config, null, 2));
  const [jsonError, setJsonError] = useState(null);
  const [expandedMsgId, setExpandedMsgId] = useState(null);

  // Drag-and-drop state
  const dragSrcIndex = useRef(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [dragOverSide, setDragOverSide] = useState(null); // 'top' | 'bottom'

  const handleApplyJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      onChangeConfig(parsed);
      setJsonError(null);
    } catch (err) {
      setJsonError(err.message);
    }
  };

  const handleLoadPreset = (presetKey) => {
    if (samplePresets[presetKey]) {
      const newCfg = { ...config, ...samplePresets[presetKey] };
      onChangeConfig(newCfg);
      setJsonText(JSON.stringify(newCfg, null, 2));
    }
  };

  const handleAddMessage = (type = 'incoming') => {
    // Map shorthand date types → system date-divider
    const isToday = type === 'date-today';
    const isYesterday = type === 'date-yesterday';
    const isDateShortcut = isToday || isYesterday;

    const newMsg = {
      id: `msg-${Date.now()}`,
      type: isDateShortcut ? 'system' : type,
      // Date-divider fields
      ...(isDateShortcut && {
        isDateDivider: true,
        dateText: isToday ? 'TODAY' : 'YESTERDAY',
      }),
      // Regular message fields
      text: (type === 'unread-divider' || isDateShortcut) ? '' : 'New message content...',
      time: '9:05 pm',
      status: type === 'outgoing' ? 'seen' : undefined,
      count: type === 'unread-divider' ? 3 : undefined,
      typingDuration: 1000,
      delay: 800,
    };
    const updatedMessages = [...(config.messages || []), newMsg];
    onChangeConfig({ ...config, messages: updatedMessages });
    setExpandedMsgId(newMsg.id);
  };

  const handleUpdateMessage = (index, field, value) => {
    const updated = [...(config.messages || [])];
    updated[index] = { ...updated[index], [field]: value };
    onChangeConfig({ ...config, messages: updated });
  };

  const handleDeleteMessage = (index) => {
    const updated = (config.messages || []).filter((_, i) => i !== index);
    onChangeConfig({ ...config, messages: updated });
  };

  // ── Drag & Drop reorder handlers ──────────────────────────────────────────
  const handleDragStart = (e, index) => {
    dragSrcIndex.current = index;
    e.dataTransfer.effectAllowed = 'move';
    // Minimal ghost: just the card itself (browser default)
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragSrcIndex.current === null || dragSrcIndex.current === index) {
      setDragOverIndex(null);
      return;
    }
    // Determine whether cursor is in the top or bottom half of the card
    const rect = e.currentTarget.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const side = e.clientY < midY ? 'top' : 'bottom';
    setDragOverIndex(index);
    setDragOverSide(side);
  };

  const handleDragEnd = () => {
    dragSrcIndex.current = null;
    setDragOverIndex(null);
    setDragOverSide(null);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const srcIndex = dragSrcIndex.current;
    if (srcIndex === null || srcIndex === dropIndex) {
      handleDragEnd();
      return;
    }
    // Determine insert position: before or after drop target
    const rect = e.currentTarget.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    let insertAt = e.clientY < midY ? dropIndex : dropIndex + 1;
    // Adjust for the removal of the source element
    if (srcIndex < insertAt) insertAt -= 1;

    const msgs = [...(config.messages || [])];
    const [moved] = msgs.splice(srcIndex, 1);
    msgs.splice(insertAt, 0, moved);
    onChangeConfig({ ...config, messages: msgs });
    handleDragEnd();
  };

  // 1-click cycle tick status
  const handleCycleTickStatus = (index, currentStatus = 'seen') => {
    const cycle = ['sent', 'delivered', 'seen', 'clock'];
    const nextIdx = (cycle.indexOf(currentStatus) + 1) % cycle.length;
    handleUpdateMessage(index, 'status', cycle[nextIdx]);
  };

  return (
    <div className="wa-config-panel">
      {/* Tab Navigation */}
      <div className="wa-config-tabs">
        <button
          type="button"
          className={`wa-config-tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          <MessageSquare size={16} />
          <span>Messages ({config.messages?.length || 0})</span>
        </button>

        <button
          type="button"
          className={`wa-config-tab-btn ${activeTab === 'contact' ? 'active' : ''}`}
          onClick={() => setActiveTab('contact')}
        >
          <User size={16} />
          <span>Contact Info</span>
        </button>

        <button
          type="button"
          className={`wa-config-tab-btn ${activeTab === 'json' ? 'active' : ''}`}
          onClick={() => {
            setJsonText(JSON.stringify(config, null, 2));
            setActiveTab('json');
          }}
        >
          <Code size={16} />
          <span>JSON</span>
        </button>

        {/* Quick Save Button */}
        {onSaveConfig && (
          <button
            type="button"
            className={`wa-config-save-btn ${saveToast ? 'saved' : ''}`}
            onClick={onSaveConfig}
            title="Save changes to browser"
          >
            <Check size={14} />
            <span>{saveToast ? "Saved!" : "Save"}</span>
          </button>
        )}
      </div>


      {/* Preset Pickers */}
      <div className="wa-preset-bar">
        <span className="wa-preset-label">1-on-1 Presets:</span>
        <button
          type="button"
          className="wa-preset-pill"
          onClick={() => handleLoadPreset('sarahChat')}
        >
          Sarah (Online)
        </button>
        <button
          type="button"
          className="wa-preset-pill"
          onClick={() => handleLoadPreset('alexTech')}
        >
          Alex (Last seen)
        </button>
      </div>

      <div className="wa-config-content">
        {/* CONTACT INFO TAB */}
        {activeTab === 'contact' && (
          <div className="wa-config-form">
            <div className="wa-field-group">
              <label>Contact Name</label>
              <input
                type="text"
                className="wa-input"
                value={config.name || config.groupName || ''}
                onChange={(e) => onChangeConfig({ ...config, name: e.target.value, groupName: e.target.value })}
                placeholder="e.g. Sarah Jenkins"
              />
            </div>

            <div className="wa-field-group">
              <label>Header Status</label>
              <input
                type="text"
                className="wa-input"
                value={config.status || ''}
                onChange={(e) => onChangeConfig({ ...config, status: e.target.value })}
                placeholder="e.g. online, last seen today at 8:45 pm"
              />
            </div>

            <div className="wa-field-group">
              <label>Contact Profile Photo URL</label>
              <div className="wa-avatar-input-row">
                <img
                  src={config.avatar}
                  alt="Contact avatar preview"
                  className="wa-avatar-preview-sm"
                />
                <input
                  type="text"
                  className="wa-input"
                  value={config.avatar || ''}
                  onChange={(e) => onChangeConfig({ ...config, avatar: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="wa-field-group">
              <label>Wallpaper Doodle Opacity</label>
              <input
                type="range"
                min="0.01"
                max="0.2"
                step="0.005"
                value={config.wallpaperOpacity ?? 0.055}
                onChange={(e) => onChangeConfig({ ...config, wallpaperOpacity: parseFloat(e.target.value) })}
              />
              <span className="wa-hint">{Math.round((config.wallpaperOpacity ?? 0.055) * 100)}%</span>
            </div>
          </div>
        )}

        {/* MESSAGES TAB */}
        {activeTab === 'messages' && (
          <div className="wa-messages-editor">
            {/* Quick Add Buttons */}
            <div className="wa-add-btn-row">
              <button
                type="button"
                className="wa-add-btn incoming"
                onClick={() => handleAddMessage('incoming')}
              >
                <Plus size={15} /> Incoming Msg
              </button>
              <button
                type="button"
                className="wa-add-btn outgoing"
                onClick={() => handleAddMessage('outgoing')}
              >
                <Plus size={15} /> Outgoing Msg
              </button>
              <button
                type="button"
                className="wa-add-btn system"
                onClick={() => handleAddMessage('system')}
              >
                <Plus size={15} /> System Msg
              </button>
              <button
                type="button"
                className="wa-add-btn unread"
                onClick={() => handleAddMessage('unread-divider')}
              >
                <Plus size={15} /> Unread Divider
              </button>
              <button
                type="button"
                className="wa-add-btn date-today"
                onClick={() => handleAddMessage('date-today')}
              >
                <Plus size={15} /> Today
              </button>
              <button
                type="button"
                className="wa-add-btn date-yesterday"
                onClick={() => handleAddMessage('date-yesterday')}
              >
                <Plus size={15} /> Yesterday
              </button>
            </div>

            {/* List of Messages — Drag & Drop to reorder */}
            <div className="wa-message-cards-list">
              {(config.messages || []).map((msg, idx) => {
                const isExpanded = expandedMsgId === msg.id;
                const isDragOver = dragOverIndex === idx;

                return (
                  <div
                    key={msg.id || idx}
                    className={`wa-msg-edit-card type-${msg.type} ${isExpanded ? 'expanded' : ''} ${isDragOver ? `drag-over-${dragOverSide}` : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDragEnd={handleDragEnd}
                    onDrop={(e) => handleDrop(e, idx)}
                  >
                    <div
                      className="wa-msg-edit-card-header"
                      onClick={() => setExpandedMsgId(isExpanded ? null : msg.id)}
                    >
                      {/* Drag handle */}
                      <span
                        className="wa-drag-handle"
                        title="Drag to reorder"
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        <GripVertical size={14} />
                      </span>
                      <span className={`wa-type-badge ${msg.type}`}>{msg.type}</span>

                      {/* If outgoing, show tick indicator in header */}
                      {msg.type === 'outgoing' && (
                        <button
                          type="button"
                          className="wa-header-tick-toggle"
                          title="Click to cycle status: Sent (Single) -> Delivered (Double) -> Seen (Blue) -> Clock"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCycleTickStatus(idx, msg.status || 'seen');
                          }}
                        >
                          <StatusTick status={msg.status || 'seen'} size={18} />
                        </button>
                      )}

                      <span className="wa-msg-header-summary">
                        {msg.type === 'unread-divider'
                          ? `${msg.count || 3} unread messages`
                          : msg.type === 'system'
                          ? (msg.isDateDivider ? msg.dateText || 'DATE' : msg.action)
                          : `${msg.text || (msg.image ? '[Image Attachment]' : '')}`}
                      </span>

                      <span className="wa-msg-header-time">{msg.time}</span>
                      <button
                        type="button"
                        className="wa-icon-action-btn delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMessage(idx);
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>

                    {isExpanded && (
                      <div className="wa-msg-edit-card-body">
                        {/* Message Type */}
                        <div className="wa-field-row">
                          <label>Type</label>
                          <select
                            className="wa-select"
                            value={msg.type}
                            onChange={(e) => handleUpdateMessage(idx, 'type', e.target.value)}
                          >
                            <option value="incoming">Incoming (Left Dark Gray)</option>
                            <option value="outgoing">Outgoing (Right Green)</option>
                            <option value="system">System Notification</option>
                            <option value="unread-divider">Unread / Date Divider</option>
                          </select>
                        </div>

                        {/* OUTGOING TICK STATUS SELECTOR */}
                        {msg.type === 'outgoing' && (
                          <div className="wa-field-group wa-tick-control-group">
                            <label className="wa-tick-group-title">
                              WhatsApp Tick Status (Delivery / Seen Receipt)
                            </label>
                            <div className="wa-tick-options-grid">
                              {/* 1. Single Tick (Sent) */}
                              <button
                                type="button"
                                className={`wa-tick-option-btn ${msg.status === 'sent' || msg.status === 'single' ? 'active' : ''}`}
                                onClick={() => handleUpdateMessage(idx, 'status', 'sent')}
                              >
                                <StatusTick status="sent" size={20} />
                                <div className="wa-tick-btn-text">
                                  <span className="wa-tick-main-label">Sent</span>
                                  <span className="wa-tick-sub-label">Single gray tick</span>
                                </div>
                              </button>

                              {/* 2. Double Tick (Delivered) */}
                              <button
                                type="button"
                                className={`wa-tick-option-btn ${msg.status === 'delivered' || msg.status === 'double' ? 'active' : ''}`}
                                onClick={() => handleUpdateMessage(idx, 'status', 'delivered')}
                              >
                                <StatusTick status="delivered" size={20} />
                                <div className="wa-tick-btn-text">
                                  <span className="wa-tick-main-label">Delivered</span>
                                  <span className="wa-tick-sub-label">Double gray ticks</span>
                                </div>
                              </button>

                              {/* 3. Blue Tick (Seen / Read) */}
                              <button
                                type="button"
                                className={`wa-tick-option-btn ${(msg.status === 'seen' || msg.status === 'read' || !msg.status) ? 'active' : ''}`}
                                onClick={() => handleUpdateMessage(idx, 'status', 'seen')}
                              >
                                <StatusTick status="seen" size={20} />
                                <div className="wa-tick-btn-text">
                                  <span className="wa-tick-main-label">Seen</span>
                                  <span className="wa-tick-sub-label">Double blue ticks</span>
                                </div>
                              </button>

                              {/* 4. Clock (Sending) */}
                              <button
                                type="button"
                                className={`wa-tick-option-btn ${msg.status === 'clock' || msg.status === 'sending' ? 'active' : ''}`}
                                onClick={() => handleUpdateMessage(idx, 'status', 'clock')}
                              >
                                <StatusTick status="clock" size={18} />
                                <div className="wa-tick-btn-text">
                                  <span className="wa-tick-main-label">Sending</span>
                                  <span className="wa-tick-sub-label">Clock icon</span>
                                </div>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* If System (date divider or general) */}
                        {msg.type === 'system' && (
                          <div className="wa-field-group">
                            {/* Date Divider toggle */}
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <input
                                type="checkbox"
                                checked={!!msg.isDateDivider}
                                onChange={(e) => handleUpdateMessage(idx, 'isDateDivider', e.target.checked)}
                              />
                              <span>Date Divider Pill (TODAY / YESTERDAY / custom)</span>
                            </label>

                            {msg.isDateDivider ? (
                              <>
                                <label>Date Label</label>
                                <div style={{ display: 'flex', gap: 6 }}>
                                  <button
                                    type="button"
                                    className={`wa-date-quick-btn ${msg.dateText === 'TODAY' ? 'active' : ''}`}
                                    onClick={() => handleUpdateMessage(idx, 'dateText', 'TODAY')}
                                  >Today</button>
                                  <button
                                    type="button"
                                    className={`wa-date-quick-btn ${msg.dateText === 'YESTERDAY' ? 'active' : ''}`}
                                    onClick={() => handleUpdateMessage(idx, 'dateText', 'YESTERDAY')}
                                  >Yesterday</button>
                                </div>
                                <input
                                  type="text"
                                  className="wa-input"
                                  value={msg.dateText || 'TODAY'}
                                  onChange={(e) => handleUpdateMessage(idx, 'dateText', e.target.value.toUpperCase())}
                                  placeholder="TODAY, YESTERDAY, MON 15 SEP…"
                                />
                              </>
                            ) : (
                              <>
                                <label>System Text</label>
                                <input
                                  type="text"
                                  className="wa-input"
                                  value={msg.action || ''}
                                  onChange={(e) => handleUpdateMessage(idx, 'action', e.target.value)}
                                  placeholder="e.g. Messages and calls are end-to-end encrypted."
                                />
                              </>
                            )}
                          </div>
                        )}

                        {/* Standard Message Text */}
                        {(msg.type === 'incoming' || msg.type === 'outgoing') && (
                          <>
                            <div className="wa-field-group">
                              <label>Message Content</label>
                              <textarea
                                className="wa-textarea"
                                rows={2}
                                value={msg.text || ''}
                                onChange={(e) => handleUpdateMessage(idx, 'text', e.target.value)}
                                placeholder="Enter message text..."
                              />
                            </div>

                            {/* Image Attachment */}
                            <div className="wa-field-group">
                              <label>Image Attachment URL (optional)</label>
                              <input
                                type="text"
                                className="wa-input"
                                value={msg.image || ''}
                                onChange={(e) => handleUpdateMessage(idx, 'image', e.target.value)}
                                placeholder="https://..."
                              />
                            </div>

                            {/* Image Caption */}
                            {msg.image && (
                              <div className="wa-field-group">
                                <label>Image Caption</label>
                                <input
                                  type="text"
                                  className="wa-input"
                                  value={msg.caption || ''}
                                  onChange={(e) => handleUpdateMessage(idx, 'caption', e.target.value)}
                                  placeholder="Caption for this image..."
                                />
                              </div>
                            )}

                            {/* Timestamp */}
                            <div className="wa-field-group">
                              <label>Time</label>
                              <input
                                type="text"
                                className="wa-input"
                                value={msg.time || '9:00 pm'}
                                onChange={(e) => handleUpdateMessage(idx, 'time', e.target.value)}
                                placeholder="e.g. 8:59 pm"
                              />
                            </div>

                            {/* Animation Timing */}
                            <div className="wa-field-row">
                              <div>
                                <label>Typing Duration (ms)</label>
                                <input
                                  type="number"
                                  className="wa-input"
                                  value={msg.typingDuration ?? 1000}
                                  onChange={(e) => handleUpdateMessage(idx, 'typingDuration', Number(e.target.value))}
                                />
                              </div>
                              <div>
                                <label>Delay After (ms)</label>
                                <input
                                  type="number"
                                  className="wa-input"
                                  value={msg.delay ?? 800}
                                  onChange={(e) => handleUpdateMessage(idx, 'delay', Number(e.target.value))}
                                />
                              </div>
                            </div>

                            {/* ── Reaction ──────────────────────────────── */}
                            <div className="wa-field-group wa-reaction-group">
                              <label className="wa-tick-group-title">Emoji Reaction</label>
                              <div className="wa-reaction-quick-row">
                                {['❤️','😂','😮','😢','🙏','👍','🔥','😍'].map((emoji) => (
                                  <button
                                    key={emoji}
                                    type="button"
                                    className={`wa-reaction-quick-btn ${msg.reaction === emoji ? 'active' : ''}`}
                                    onClick={() =>
                                      handleUpdateMessage(idx, 'reaction', msg.reaction === emoji ? '' : emoji)
                                    }
                                    title={emoji}
                                  >
                                    {emoji}
                                  </button>
                                ))}
                              </div>
                              <input
                                type="text"
                                className="wa-input"
                                value={msg.reaction || ''}
                                onChange={(e) => handleUpdateMessage(idx, 'reaction', e.target.value)}
                                placeholder="Custom emoji (or leave blank for none)"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* JSON TAB */}
        {activeTab === 'json' && (
          <div className="wa-json-editor-view">
            <p className="wa-hint">
              Direct JSON editing. Copy and paste conversation data anytime.
            </p>
            <textarea
              className="wa-json-textarea"
              rows={18}
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
            />
            {jsonError && <div className="wa-json-error">Invalid JSON: {jsonError}</div>}
            <button
              type="button"
              className="wa-tool-btn wa-tool-btn-primary"
              onClick={handleApplyJson}
            >
              <Check size={16} />
              <span>Apply JSON Changes</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
