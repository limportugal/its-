<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Deactivation Notice</title>
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

        .info-box {
            background-color: #f8fafc;
            padding: 24px;
            border-radius: 12px;
            margin: 24px 0;
            border: 1px solid #e2e8f0;
        }

        .info-row {
            display: flex;
            margin-bottom: 12px;
            padding-bottom: 12px;
            border-bottom: 1px solid #e2e8f0;
        }

        .info-row:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }

        .info-label {
            flex: 0 0 180px;
            color: #64748b;
            font-weight: 500;
        }

        .info-value {
            flex: 1;
            color: #0f172a;
        }

        .message {
            background-color: #fef2f2;
            border-left: 4px solid #ef4444;
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

        /* Info Alert Styles */
        .info-alert {
            background-color: #f0f9ff;
            border: 1px solid #0ea5e9;
            border-radius: 8px;
            padding: 12px 16px;
            margin: 24px 0;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .info-alert-icon {
            background-color: #0ea5e9;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            flex-shrink: 0;
        }

        .info-alert-text {
            margin: 0;
            color: #0c4a6e;
            font-size: 14px;
            font-weight: 500;
        }

        @media only screen and (max-width: 600px) {
            .container {
                padding: 16px;
            }

            .info-row {
                flex-direction: column;
            }

            .info-label {
                margin-bottom: 4px;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>Account Deactivation Notice</h1>
            <p>Dear {{ $full_name }},</p>
        </div>

        <div class="message">
            This email is to inform you that your account has been deactivated effective
            {{ date('M. d, Y h:i A', strtotime($deactivated_at)) }}.
        </div>

        <!-- ACCOUNT DETAILS -->
        <div class="info-box">
            <!-- USER DETAILS -->
            <div class="info-row">
                <div class="info-label">Name</div>
                <div class="info-value">{{ $full_name }}</div>
            </div>

            <!-- EMAIL -->
            <div class="info-row">
                <div class="info-label">Email</div>
                <div class="info-value">{{ $email }}</div>
            </div>

            <!-- DEACTIVATION DATE -->
            <div class="info-row">
                <div class="info-label">Deactivation Date</div>
                <div class="info-value">{{ date('M. d, Y h:i A', strtotime($deactivated_at)) }}</div>
            </div>

            <!-- REASON -->
            @if (isset($reason))
                <div class="info-row">
                    <div class="info-label">Reason</div>
                    <div class="info-value">{{ $reason }}</div>
                </div>
            @endif

            <!-- DEACTIVATED BY -->
            <div class="info-row">
                <div class="info-label">Deactivated By</div>
                <div class="info-value">{{ $deactivator_name }}</div>
            </div>
        </div>

        <!-- ADDITIONAL INFO -->
        <div class="message">
            If you believe this is an error or have any questions, please contact our support team immediately.
        </div>

        <!-- INFO ALERT -->
        <div class="info-alert">
            <div class="info-alert-icon">i</div>
            <p class="info-alert-text">This is an automated message. Please do not reply to this email.</p>
        </div>

        <!-- FOOTER -->
        <div class="footer">
            <p>Best regards,<br>Apsoft Team Team</p>
            <p><small>&copy; {{ date('Y') }} Apsoft | Phillogix | Ideaserv</small></p>
            <a href="{{ $support_portal_link }}" target="_blank">Access Support Portal</a>
        </div>
    </div>
</body>

</html>
