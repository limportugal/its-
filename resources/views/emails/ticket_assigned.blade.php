<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ticket Assignment</title>
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
    @php
        $fixMojibake = static function ($value) {
            if (!is_string($value) || $value === '') {
                return $value;
            }

            if (!preg_match('/Ã.|Â.|â.|ðŸ/u', $value)) {
                return $value;
            }

            return mb_convert_encoding($value, 'ISO-8859-1', 'UTF-8');
        };

        $categoryDisplay = is_array($category_name) || is_object($category_name)
            ? implode(', ', (array) $category_name)
            : $category_name;
    @endphp
    <div class="container">
        <div class="header">
            <h1>Ticket Assignment Notification</h1>
            <p>A ticket has been assigned to you for your attention.</p>
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
                        <td>{{ $fixMojibake($reported_by_name) }}</td>
                    </tr>

                    <!-- REPORTER EMAIL -->
                    <tr>
                        <th>📧 Reporter Email</th>
                        <td>{{ $fixMojibake($reported_by_email) }}</td>
                    </tr>



                    <!-- TICKET NUMBER -->
                    <tr>
                        <th>🎫 Ticket Number</th>
                        <td><strong>{{ $ticket_number }}</strong></td>
                    </tr>

                    <!-- PRIORITY -->
                    <tr>
                        <th>⚡ Priority</th>
                        <td>{{ $fixMojibake($priority) }}</td>
                    </tr>

                    <!-- PROBLEM ENCOUNTERED -->
                    <tr>
                        <th>⚠️ Problem Category</th>
                        <td>{{ $fixMojibake($categoryDisplay) }}</td>
                    </tr>

                    <!-- SERVICE CENTER -->
                    <tr>
                        <th>🏢 Service Center</th>
                        <td>{{ $fixMojibake($service_center_name) }}</td>
                    </tr>

                    <!-- SYSTEM -->
                    <tr>
                        <th>💻 System</th>
                        <td>{{ $fixMojibake($system_name) }}</td>
                    </tr>

                    <!-- DESCRIPTION -->
                    <tr>
                        <th>📝 Description</th>
                        <td>{{ $fixMojibake($description) }}</td>
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

                    <!-- ASSIGNED TO AGENT -->
                    @if(isset($assigned_to) && $assigned_to)
                    <tr>
                        <th>👤 Assigned To Agent</th>
                        <td><strong>{{ $fixMojibake($assigned_to) }}</strong></td>
                    </tr>
                    @endif

                    <!-- YOUR EMAIL -->
                    @if(isset($assigned_user_email) && $assigned_user_email)
                    <tr>
                        <th>📧 Your Email</th>
                        <td><strong>{{ $fixMojibake($assigned_user_email) }}</strong></td>
                    </tr>
                    @endif
                </tbody>
            </table>
        </div>

        <!-- MESSAGE -->
        <div class="message">
            <strong style="display: block; margin-bottom: 8px;">Action Required:</strong>
            You have been assigned this ticket. Please review the details and take necessary action to resolve the issue.
        </div>

        <!-- VIEW TICKET DETAILS BUTTON -->
        <div class="button-container">
            <a href="{{ $view_tickets_link }}" class="action-button" target="_blank">
                VIEW TICKET DETAILS
            </a>
        </div>

        <!-- FOOTER -->
        <div class="footer">
            <p>Best regards,<br>Research and Development</p>
            <p><small>&copy; {{ date('Y') }} <a href="https://apsoft.com.ph/" target="_blank">Apsoft Inc.</a> | <a href="https://phillogix.site/" target="_blank">Phillogix Systems</a> | <a href="https://its.ideaserv.online/" target="_blank">ideaserv Systems, Inc.</a><br>
                    <a href="{{ $support_portal_link }}" target="_blank">View Pending Tickets</a></small></p>
        </div>
    </div>
</body>

</html>
