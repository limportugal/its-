<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ticket Assignment Notification</title>
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
            background-color: #ecfdf5;
            color: #065f46;
        }

        .message {
            background-color: #f0f9ff;
            border-left: 4px solid #3b82f6;
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

        /* Assigned Agent Card Styling */
        .assigned-agent-card {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            border-radius: 16px;
            padding: 24px;
            margin: 24px 0;
            color: #334155;
            text-align: center;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
            border: 1px solid #e2e8f0;
            position: relative;
            overflow: hidden;
        }

        .assigned-agent-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="%23334155" opacity="0.03"/><circle cx="75" cy="75" r="1" fill="%23334155" opacity="0.03"/><circle cx="50" cy="10" r="0.5" fill="%23334155" opacity="0.02"/><circle cx="10" cy="60" r="0.5" fill="%23334155" opacity="0.02"/><circle cx="90" cy="40" r="0.5" fill="%23334155" opacity="0.02"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            pointer-events: none;
        }

        .assigned-agent-content {
            position: relative;
            z-index: 1;
        }

        .agent-icon {
            font-size: 48px;
            margin-bottom: 16px;
            display: block;
        }

        .agent-avatar {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            margin: 0 auto 16px auto;
            display: block;
            object-fit: cover;
            border: 3px solid #ffffff;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            background-color: #f3f4f6;
        }

        .agent-avatar-fallback {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            margin: 0 auto 16px auto;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #3b82f6;
            color: #ffffff;
            font-size: 20px;
            font-weight: 600;
            border: 3px solid #ffffff;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .agent-label {
            font-size: 14px;
            font-weight: 500;
            color: #64748b;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .agent-name {
            font-size: 24px;
            font-weight: 700;
            margin: 0;
            color: #1e293b;
        }

        .agent-status {
            font-size: 12px;
            color: #64748b;
            margin-top: 8px;
            font-weight: 500;
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
            <h1>Your Ticket Has Been Assigned</h1>
            <p>Great news! Your ticket has been assigned to a support agent and is now being processed.</p>
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
                        <td>{{ $priority }}</td>
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
                                Assigned
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- ASSIGNED AGENTS CARD -->
        @if(isset($assigned_users) && $assigned_users->count() > 0)
            @if($assigned_users->count() === 1)
                <!-- SINGLE AGENT CARD -->
                @php $agent = $assigned_users->first(); @endphp
                <div class="assigned-agent-card">
                    <div class="assigned-agent-content">
                        @if(isset($agent['avatar_url']) && $agent['avatar_url'])
                            <img src="{{ $agent['avatar_url'] }}" alt="{{ $agent['first_letter'] }}" class="agent-avatar">
                        @else
                            <div class="agent-avatar-fallback">{{ $agent['first_letter'] }}</div>
                        @endif
                        <div class="agent-label">Assigned To Agent</div>
                        <h3 class="agent-name">{{ $agent['name'] }}</h3>
                        <div class="agent-status">Your ticket is now being handled</div>
                        @if(isset($agent['assigned_at']))
                        <div class="agent-status" style="margin-top: 4px; font-size: 11px; opacity: 0.7;">
                            Assigned on {{ date('M d, Y \a\t h:i A', strtotime($agent['assigned_at'])) }}
                        </div>
                        @endif
                    </div>
                </div>
            @else
                <!-- MULTIPLE AGENTS CARD -->
                <div class="assigned-agent-card">
                    <div class="assigned-agent-content">
                        <div class="agent-icon">👥</div>
                        <div class="agent-label">Assigned To Multiple Agents</div>
                        <h3 class="agent-name">{{ $assigned_users->count() }} Support Agents</h3>
                        <div class="agent-status">Your ticket is being handled by multiple specialists</div>
                        <div style="margin-top: 16px; text-align: left;">
                            @foreach($assigned_users as $agent)
                                <div style="display: flex; align-items: center; margin-bottom: 8px; padding: 8px; background: rgba(255,255,255,0.1); border-radius: 8px;">
                                    @if(isset($agent['avatar_url']) && $agent['avatar_url'])
                                        <img src="{{ $agent['avatar_url'] }}" alt="{{ $agent['first_letter'] }}" style="width: 32px; height: 32px; border-radius: 50%; margin-right: 12px; border: 2px solid #ffffff;">
                                    @else
                                        <div style="width: 32px; height: 32px; border-radius: 50%; background-color: #3b82f6; color: #ffffff; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px; margin-right: 12px; border: 2px solid #ffffff;">{{ $agent['first_letter'] }}</div>
                                    @endif
                                    <div>
                                        <div style="font-weight: 600; font-size: 14px; color: #1e293b;">{{ $agent['name'] }}</div>
                                        <div style="font-size: 12px; color: #64748b;">{{ $agent['email'] }}</div>
                                    </div>
                                </div>
                            @endforeach
                        </div>
                        @if(isset($assigned_at))
                        <div class="agent-status" style="margin-top: 12px; font-size: 11px; opacity: 0.7;">
                            First assigned on {{ date('M d, Y \a\t h:i A', strtotime($assigned_at)) }}
                        </div>
                        @endif
                    </div>
                </div>
            @endif
        @endif

        <!-- MESSAGE -->
        <div class="message">
            <strong style="display: block; margin-bottom: 8px;">Good News:</strong>
            Your ticket has been assigned to a support agent who will be working on resolving your issue.
        </div>

        <!-- FOLLOW UP BUTTON -->
        <div class="button-container">
            <a href="{{ $follow_up_link }}" class="action-button">
                FOLLOW UP
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
