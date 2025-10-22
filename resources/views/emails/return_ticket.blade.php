<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ticket Returned</title>
    <style>
        /* General Styles */
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f8fafc;
            margin: 0;
            padding: 0;
            color: #334155;
            line-height: 1.6;
        }

        .container {
            width: 100%;
            max-width: 100%;
            margin: 0;
            background-color: #ffffff;
            padding: 32px;
            box-sizing: border-box;
        }

        .header {
            text-align: center;
            margin-bottom: 32px;
            padding-bottom: 24px;
            border-bottom: 1px solid #e2e8f0;
        }

        h1 {
            color: #0f172a;
            font-size: 24px;
            font-weight: 600;
            margin: 0 0 16px;
        }

        .ticket-info {
            background-color: #ffffff;
            border-radius: 12px;
            margin: 24px 0;
            border: 1px solid #e2e8f0;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            overflow: hidden;
        }

        .ticket-table {
            width: 100%;
            border-collapse: collapse;
            background-color: #ffffff;
        }

        .ticket-table th {
            background-color: rgba(248, 250, 252, 0.8);
            color: #3b82f6;
            font-weight: 600;
            text-align: left;
            padding: 16px 20px;
            border-bottom: 1px solid #e2e8f0;
            width: 30%;
            font-size: 14px;
        }

        .ticket-table td {
            padding: 16px 20px;
            border-bottom: 1px solid #e2e8f0;
            color: #0f172a;
            font-size: 14px;
            line-height: 1.5;
        }

        .ticket-table tr:last-child th,
        .ticket-table tr:last-child td {
            border-bottom: none;
        }

        .ticket-table tr:hover {
            background-color: #f8fafc;
        }

        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 16px;
            font-size: 14px;
            font-weight: 500;
            background-color: #fff7ed;
            color: #ea580c;
        }

        .section-divider {
            background-color: #fdf2f8;
            padding: 12px 20px;
            margin: 0;
            border-top: 2px solid #f9a8d4;
            border-bottom: 2px solid #f9a8d4;
        }

        .section-title {
            font-weight: 600;
            color: #be185d;
            font-size: 16px;
            margin: 0;
            text-align: center;
        }

        .message {
            background-color: #fff7ed;
            border-left: 4px solid #ea580c;
            padding: 16px;
            margin: 24px 0;
            border-radius: 0 8px 8px 0;
        }

        .footer {
            text-align: center;
            color: #64748b;
            font-size: 14px;
            margin-top: 40px;
            padding-top: 24px;
            border-top: 1px solid #e2e8f0;
        }

        .footer a {
            color: #3b82f6;
            text-decoration: none;
            transition: all 0.2s ease;
        }

        .footer a:hover {
            color: #1d4ed8;
            text-decoration: underline;
        }

        @media only screen and (max-width: 600px) {
            .container {
                padding: 16px;
            }

            .ticket-table th,
            .ticket-table td {
                padding: 12px 16px;
                font-size: 13px;
            }

            .ticket-table th {
                width: 35%;
            }

            h1 {
                font-size: 20px;
            }

            .priority-chip {
                font-size: 12px;
                padding: 4px 8px;
            }

            .action-button {
                padding: 10px 20px;
                font-size: 14px;
            }

            /* Mobile styles for unified return card */
            .unified-return-card {
                padding: 20px;
                margin: 16px 0;
            }

            .agent-section {
                flex-direction: column;
                text-align: center;
                margin-bottom: 20px;
                padding-bottom: 16px;
            }

            .unified-agent-avatar {
                margin-right: 0;
                margin-bottom: 16px;
                width: 64px;
                height: 64px;
            }

            .agent-info {
                text-align: center;
            }

            .agent-name {
                font-size: 18px;
            }

        }

        /* Priority Styles */
        .priority-chip {
            padding: 6px 12px;
            border-radius: 999px;
            font-size: 14px;
            display: inline-block;
            text-transform: capitalize;
        }

        .priority-low {
            background-color: #a5d6a7;
            color: #000;
        }

        .priority-medium {
            background-color: #fff59d;
            color: #000;
        }

        .priority-high {
            background-color: #ef9a9a;
            color: #000;
        }

        .priority-critical {
            background-color: #ef5350;
            color: #fff;
        }

        /* Button Styling */
        .button-container {
            text-align: center;
            margin: 32px 0;
        }

        .action-button {
            display: inline-block;
            background-color: #2563eb !important;
            color: #ffffff !important;
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 16px;
            transition: all 0.2s ease;
            border: 1px solid #1d4ed8;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
        }

        .action-button:hover {
            background-color: #1d4ed8;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
        }

        /* Return Details Card Styling */
        .return-details-card {
            background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%);
            border-radius: 16px;
            padding: 24px;
            margin: 24px 0;
            color: #334155;
            text-align: center;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
            border: 1px solid #fdba74;
            position: relative;
            overflow: hidden;
        }

        .return-details-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="%23ea580c" opacity="0.03"/><circle cx="75" cy="75" r="1" fill="%23ea580c" opacity="0.03"/><circle cx="50" cy="10" r="0.5" fill="%23ea580c" opacity="0.02"/><circle cx="10" cy="60" r="0.5" fill="%23ea580c" opacity="0.02"/><circle cx="90" cy="40" r="0.5" fill="%23ea580c" opacity="0.02"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            pointer-events: none;
        }

        .return-details-content {
            position: relative;
            z-index: 1;
        }

        .return-icon {
            font-size: 48px;
            margin-bottom: 16px;
            display: block;
        }

        .return-label {
            font-size: 14px;
            font-weight: 500;
            color: #ea580c;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .return-reason {
            font-size: 16px;
            font-weight: 600;
            margin: 12px 0;
            color: #1e293b;
            line-height: 1.5;
            padding: 12px;
            background-color: rgba(255, 255, 255, 0.7);
            border-radius: 8px;
            border-left: 4px solid #fb923c;
        }

        .return-meta {
            font-size: 12px;
            color: #64748b;
            margin-top: 8px;
            font-weight: 500;
        }

        /* Unified Return Card Styling */
        .unified-return-card {
            background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%);
            border-radius: 20px;
            padding: 32px;
            margin: 24px 0;
            color: #334155;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
            border: 1px solid #fdba74;
            position: relative;
            overflow: hidden;
        }

        .unified-return-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="%23ea580c" opacity="0.03"/><circle cx="75" cy="75" r="1" fill="%23ea580c" opacity="0.03"/><circle cx="50" cy="10" r="0.5" fill="%23ea580c" opacity="0.02"/><circle cx="10" cy="60" r="0.5" fill="%23ea580c" opacity="0.02"/><circle cx="90" cy="40" r="0.5" fill="%23ea580c" opacity="0.02"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            pointer-events: none;
        }

        .unified-return-content {
            position: relative;
            z-index: 1;
        }

        .agent-section {
            display: flex;
            align-items: center;
            margin-bottom: 24px;
            padding-bottom: 20px;
            border-bottom: 2px solid rgba(251, 146, 60, 0.2);
        }

        .unified-agent-avatar {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            margin-right: 20px;
            object-fit: cover;
            border: 4px solid #ffffff;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
            flex-shrink: 0;
        }

        .agent-info {
            flex: 1;
            text-align: left;
        }

        .agent-label {
            font-size: 12px;
            font-weight: 600;
            color: #ea580c;
            margin-bottom: 6px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .agent-name {
            font-size: 20px;
            font-weight: 700;
            margin: 8px 0;
            color: #1e293b;
            line-height: 1.3;
        }

        .agent-timestamp {
            font-size: 13px;
            color: #64748b;
            font-weight: 500;
            margin-top: 4px;
        }

        .return-reason-section {
            text-align: center;
        }

        .return-label {
            font-size: 14px;
            font-weight: 600;
            color: #ea580c;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .return-reason {
            font-size: 16px;
            font-weight: 600;
            margin: 0;
            color: #1e293b;
            line-height: 1.6;
            padding: 16px 20px;
            background-color: rgba(255, 255, 255, 0.8);
            border-radius: 12px;
            border-left: 4px solid #fb923c;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            overflow: hidden;
        }

        /* Info Alert Styles */
        .info-alert {
            background-color: #e0f2f7;
            border-radius: 8px;
            padding: 12px 16px;
            margin: 0;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 16px;
            text-align: center;
            width: fit-content;
            max-width: 100%;
        }

        .info-alert-icon {
            background-color: #3b82f6;
            color: #ffffff;
            border-radius: 50%;
            width: 22px;
            height: 22px;
            display: inline-block;
            font-size: 12px;
            font-weight: bold;
            flex-shrink: 0;
            line-height: 22px;
            font-family: Arial, sans-serif;
            text-align: center;
            vertical-align: middle;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        .info-alert-text {
            color: #01579b;
            font-size: 13px;
            margin: 0;
            font-weight: 500;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>Hi, {{ $full_name }}!</h1>
            <p>Your ticket has been returned for review.</p>
            <div style="text-align: center; margin: 16px 0;">
                <div class="info-alert">
                    <div class="info-alert-icon">i</div>
                    <p class="info-alert-text">This is an automated message. Please do not reply to this email.</p>
                </div>
            </div>
        </div>

        <!-- TICKET DETAILS -->
        <div class="ticket-info">
            <table class="ticket-table">
                <tbody>
                    <!-- DATE CREATED -->
                    <tr>
                        <th>📅 Date Reported</th>
                        <td>{{ date('M. d, Y h:i A', strtotime($created_at)) }}</td>
                    </tr>

                    <!-- REPORTED BY -->
                    <tr>
                        <th>👤 Reported By</th>
                        <td>{{ $full_name }}</td>
                    </tr>

                    <!-- EMAIL -->
                    <tr>
                        <th>📧 Email</th>
                        <td>{{ $email }}</td>
                    </tr>



                    <!-- TICKET NUMBER -->
                    <tr>
                        <th>🎫 Ticket Number</th>
                        <td><strong>{{ $ticket_number }}</strong></td>
                    </tr>

                    <!-- PRIORITY -->
                    <tr>
                        <th>⚡ Priority</th>
                        <td>
                            <span class="priority-chip priority-{{ strtolower($priority) }}">{{ $priority }}</span>
                        </td>
                    </tr>

                    <!-- PROBLEM ENCOUNTERED -->
                    <tr>
                        <th>⚠️ Problem Category</th>
                        <td>
                            @if (is_array($category_name) || is_object($category_name))
                                {{ implode(', ', (array) $category_name) }}
                            @else
                                {{ $category_name }}
                            @endif
                        </td>
                    </tr>

                    <!-- SERVICE CENTER -->
                    <tr>
                        <th>🏢 Service Center</th>
                        <td>{{ $service_center_name }}</td>
                    </tr>

                    <!-- SYSTEM -->
                    <tr>
                        <th>💻 System</th>
                        <td>{{ $system_name }}</td>
                    </tr>

                    <!-- DESCRIPTION -->
                    <tr>
                        <th>📝 Description</th>
                        <td>{{ $description }}</td>
                    </tr>

                    <!-- ATTACHMENTS -->
                    <tr>
                        <th>📎 Attachments</th>
                        <td>
                            @if($attachments && $attachments->count() > 0)
                                @foreach($attachments as $attachment)
                                    <a href="{{ url('/attachment/' . $attachment->uuid) }}" target="_blank" style="color: #3b82f6; text-decoration: underline; font-weight: 500; display: block; margin-bottom: 8px;">
                                        📄 {{ $attachment->original_name }}
                                    </a>
                                @endforeach
                                <small style="color: #64748b; font-size: 12px;">Click to view attachment(s)</small>
                            @else
                                <span style="color: #64748b; font-style: italic;">No attachment provided</span>
                            @endif
                        </td>
                    </tr>

                    <!-- STATUS -->
                    <tr>
                        <th>📊 Status</th>
                        <td>
                            <span class="status-badge">
                                Returned
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- UNIFIED RETURN DETAILS CARD WITH AGENT AVATAR -->
        <div class="unified-return-card">
            <div class="unified-return-content">
                <!-- AGENT AVATAR SECTION -->
                <div class="agent-section">
                    @if(isset($returned_user_avatar_public) && $returned_user_avatar_public)
                        <img src="{{ $returned_user_avatar_public }}" alt="{{ $returned_user_first_letter ?? 'A' }}" class="unified-agent-avatar">
                    @elseif(isset($returned_user_avatar_url) && $returned_user_avatar_url)
                        <img src="{{ $returned_user_avatar_url }}" alt="{{ $returned_user_first_letter ?? 'A' }}" class="unified-agent-avatar">
                    @elseif(isset($returned_user_avatar_base64) && $returned_user_avatar_base64)
                        <img src="{{ $returned_user_avatar_base64 }}" alt="{{ $returned_user_first_letter ?? 'A' }}" class="unified-agent-avatar">
                    @else
                        <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiNmM2Y0ZjYiIHN0cm9rZT0iI2U1ZTdlYiIgc3Ryb2tlLXdpZHRoPSIxIi8+CjxjaXJjbGUgY3g9IjQwIiBjeT0iMzAiIHI9IjEwIiBmaWxsPSIjNmI3MjgwIi8+CjxwYXRoIGQ9Ik0xNyA1N0MxNyA0Ny42MTE5IDI0LjYxMTkgNDAgMzQgNDBINjZDNTUuMzg4MSA0MCA0NyA0Ny42MTE5IDQ3IDU3VjYwSDE3VjU3WiIgZmlsbD0iIzZiNzI4MCIvPgo8L3N2Zz4K" alt="Profile" class="unified-agent-avatar">
                    @endif
                    <div class="agent-info">
                        <div class="agent-label">Returned By Agent</div>
                        <h3 class="agent-name">{{ $returned_by ?? $name }}</h3>
                        @if(isset($returned_at))
                        <div class="agent-timestamp">
                            Returned on {{ date('M d, Y \a\t h:i A', strtotime($returned_at)) }}
                        </div>
                        @endif
                    </div>
                </div>

                <!-- RETURN REASON SECTION -->
                <div class="return-reason-section">
                    <div class="return-label">Return Details</div>
                    <div class="return-reason">
                        {{ $returnReason }}
                        
                        <!-- AGENT ATTACHMENTS INSIDE THE RETURN REASON CARD -->
                        @if(isset($agent_attachments) && $agent_attachments && $agent_attachments->count() > 0)
                            <div style="margin-top: 16px; padding: 16px; background-color: #f0f9ff; border-radius: 8px; border: 1px solid #bfdbfe;">
                                <div style="display: flex; align-items: center; margin-bottom: 12px;">
                                    <span style="font-size: 16px; margin-right: 8px;">📎</span>
                                    <div style="font-size: 14px; font-weight: 700; color: #1e40af; text-transform: uppercase; letter-spacing: 0.5px;">
                                        Agent Attachments
                                    </div>
                                </div>
                                @foreach($agent_attachments as $agentAttachment)
                                    <div style="margin-bottom: 8px; padding: 8px 12px; background-color: #ffffff; border-radius: 6px; border-left: 3px solid #3b82f6; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
                                        <a href="{{ url('/attachment/' . $agentAttachment->uuid) }}" target="_blank" style="color: #1e40af; text-decoration: none; font-weight: 600; font-size: 14px; display: flex; align-items: center;">
                                            <span style="margin-right: 8px; font-size: 16px;">📄</span>
                                            {{ $agentAttachment->original_name }}
                                        </a>
                                    </div>
                                @endforeach
                                <div style="margin-top: 8px; padding: 8px; background-color: #dbeafe; border-radius: 4px; border-left: 3px solid #3b82f6;">
                                    <small style="color: #1e40af; font-size: 12px; font-weight: 500;">
                                        💡 These files are attached to this email and can also be viewed online
                                    </small>
                                </div>
                            </div>
                        @endif
                    </div>
                </div>
            </div>
        </div>

        <!-- MESSAGE -->
        <div class="message">
            <strong style="display: block; margin-bottom: 8px; color: #ea580c;">Action Required:</strong>
            Please review the return reason and resubmit your ticket with the necessary details.
        </div>

        <!-- RESUBMIT TICKET BUTTON -->
        <div class="button-container">
            <a href="{{ $ticketLink }}" class="action-button" target="_blank">
                RESUBMIT TICKET WITH THE REQUESTED DETAILS
            </a>
        </div>

        <!-- FOOTER -->
        <div class="footer">
            <p>Best regards,<br>Research and Development</p>
            <p><small>&copy; {{ date('Y') }} <a href="https://apsoft.com.ph/" target="_blank">Apsoft Inc.</a> | <a href="https://phillogix.site/" target="_blank">Phillogix Systems</a> | <a href="https://ideaserv.site/" target="_blank">ideaserv Systems, Inc.</a><br>
                    <a href="{{ $support_portal_link }}" target="_blank">Access Support Portal</a></small></p>
        </div>
    </div>
</body>

</html>