import React, { useState, useEffect } from 'react';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import { showSuccessAlert } from '@/Reuseable/helpers/createAndUpdateAlerts';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { blue } from '@mui/material/colors';
import { FaHistory, FaLock } from "react-icons/fa";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

import { useDynamicMutation } from '@/Reuseable/hooks/useDynamicMutation';
import { useQueryClient } from '@tanstack/react-query';
import { uploadProfilePicture } from '@/Reuseable/api/User/profile/upload-profile-picture.api';
import { deleteProfilePicture } from '@/Reuseable/api/User/profile/delete-profile-picture.api';
import { uploadProfilePictureByUuid } from '@/Reuseable/api/User/profile/upload-profile-picture-by-uuid.api';
import { deleteProfilePictureByUuid } from '@/Reuseable/api/User/profile/delete-profile-picture-by-uuid.api';
import { UploadProfilePictureResponse, DeleteProfilePictureResponse } from '@/Reuseable/types/User/profile/profile-picture-types';
import { useAuthUser } from '@/Reuseable/hooks/useAuthUser';
import { router } from '@inertiajs/react';
import useDynamicQuery from '@/Reuseable/hooks/useDynamicQuery';
import { ProfileDataResponse } from '@/Reuseable/types/User/profile/profile-data-types';
import { fetchProfileData, fetchProfileDataByUuid } from '@/Reuseable/api/User/profile/profile-data.api';
import { fetchingErrorAlert } from '@/Reuseable/helpers/fetchErrorAlert';
import ProfileSkeleton from '@/Pages/Users/Profile/ProfileSkeleton';
import FileTypeAlert from '@/Pages/Tickets/TicketComponents/FileTypeAlert';
import FileSizeAlert from '@/Pages/Tickets/TicketComponents/FileSizeAlert';

// Import new components
import ProfilePictureModal from '@/Pages/Users/Profile/ProfilePictureModal';
import ProfileInformationCard from '@/Pages/Users/Profile/ProfileInformationCard';
import SupportAgentsCard from '@/Pages/Users/Profile/SupportAgentsCard';
import TeamLeaderCard from '@/Pages/Users/Profile/TeamLeaderCard';
import ActivityFeedTab from '@/Pages/Users/Profile/ActivityFeedTab';
import SecurityTab from '@/Pages/Users/Profile/SecurityTab';
import StatsCards from '@/Pages/Users/Profile/StatsCards';
import TabPanel from '@/Pages/Users/Profile/TabPanel';


export default function Profile({
    auth,
    user: targetUser,
}: PageProps & { user?: any }) {
    const { user, hasRole } = useAuthUser();
    const queryClient = useQueryClient();
    const [tabValue, setTabValue] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [avatarError, setAvatarError] = useState(false);
    const [_isProfilePictureLoading, setIsProfilePictureLoading] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // FETCHING DATA
    const {
        data: profileData,
        isPending: isPendingProfileData,
        isError: isErrorProfileData,
        refetch: refetchProfileData,
    } = useDynamicQuery<ProfileDataResponse>(
        ["getProfileData", targetUser?.uuid],
        () => {
            // IF TARGET USER IS PROVIDED AND AUTH USER HAS APPROPRIATE ROLES, FETCH BY UUID
            if (targetUser?.uuid && hasRole(['Super Admin', 'Admin', 'Manager', 'Branch Head'])) {
                return fetchProfileDataByUuid(targetUser.uuid);
            }
            // OTHERWISE FETCH CURRENT USER'S PROFILE DATA
            return fetchProfileData();
        },
        {
            enabled: true,
        }
    );

    // SHOW FETCH ERROR ALERT
    if (isErrorProfileData) {
        fetchingErrorAlert();
        return null;
    }


    // Reset avatar states when profile data changes
    useEffect(() => {
        if (profileData?.avatar_url) {
            setAvatarError(false);
        }
    }, [profileData?.avatar_url]);

    // Wrapper function for refetch
    const handleRefetchProfileData = () => {
        refetchProfileData();
    };

    // Listen for refetch event from AccountMenu
    useEffect(() => {
        window.addEventListener('refetchProfileData', handleRefetchProfileData);
        
        return () => {
            window.removeEventListener('refetchProfileData', handleRefetchProfileData);
        };
    }, [refetchProfileData]);

    // Reset tab to Activity Feed when viewing another user's profile (Security tab not available)
    useEffect(() => {
        if (targetUser && targetUser.uuid !== user?.uuid && tabValue === 1) {
            setTabValue(0);
        }
    }, [targetUser, user?.uuid, tabValue]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleImageClick = () => {
        // CHECK IF USER CAN UPLOAD PROFILE PICTURE
        if (canUploadProfilePicture()) {
            fileInputRef.current?.click();
        }
    };

    // FUNCTION TO CHECK IF USER CAN UPLOAD PROFILE PICTURE
    const canUploadProfilePicture = () => {
        // IF VIEWING OWN PROFILE, ALWAYS ALLOW
        if (!targetUser || targetUser.uuid === user?.uuid) {
            return true;
        }

        // SUPER ADMIN CAN UPLOAD FOR ANYONE
        if (hasRole(['Super Admin'])) {
            return true;
        }

        // ADMIN CAN ONLY UPLOAD FOR TEAM LEADER AND SUPPORT AGENT
        if (hasRole(['Admin'])) {
            const targetUserRoles = targetUser?.roles?.map((role: any) => role.name) || [];
            const allowedRolesForAdmin = ['Team Leader', 'Support Agent'];
            
            return targetUserRoles.some((role: string) => allowedRolesForAdmin.includes(role));
        }

        // MANAGER CAN ONLY UPLOAD FOR ADMIN, TEAM LEADER, AND SUPPORT AGENT
        if (hasRole(['Manager'])) {
            const targetUserRoles = targetUser?.roles?.map((role: any) => role.name) || [];
            const allowedRolesForManager = ['Admin', 'Team Leader', 'Support Agent'];
            
            return targetUserRoles.some((role: string) => allowedRolesForManager.includes(role));
        }

        return false;
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
            
            // FILE TYPE VALIDATION
            if (!allowedTypes.includes(file.type)) {
                event.target.value = '';
                setSelectedFile(null);
                FileTypeAlert({
                    fileName: file.name,
                    fileType: file.type,
                    allowedTypes: allowedTypes
                });
                return;
            }

            // FILE SIZE VALIDATION
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                event.target.value = '';
                setSelectedFile(null);
                FileSizeAlert({
                    fileName: file.name,
                    fileSize: file.size,
                    maxSize: 10 * 1024 * 1024
                });
                return;
            }

            setSelectedFile(file);
            setIsModalOpen(true);
        }
    };

    const handleAvatarLoad = () => {
        setAvatarError(false);
    };

    const handleAvatarError = () => {
        setAvatarError(true);
    };



    // PROFILE PICTURE UPLOAD MUTATION
    const { mutate: uploadProfilePictureMutation, isPending: isPendingProfilePicture } =
        useDynamicMutation({
            mutationFn: (file: File) => {
                // CHECK IF USER CAN UPLOAD PROFILE PICTURE
                if (canUploadProfilePicture() && targetUser && targetUser.uuid !== user?.uuid) {
                    return uploadProfilePictureByUuid(file, targetUser.uuid);
                } else {
                    return uploadProfilePicture(file);
                }
            },
            mutationKey: ['getProfileData', targetUser?.uuid, 'getActiveUsersData', 'getInactiveUsersData'],
            onSuccess: async (response: UploadProfilePictureResponse) => {
                setIsProfilePictureLoading(false);
                setIsModalOpen(false);
                setSelectedFile(null);
                
                // Reset avatar error state to ensure new image loads
                setAvatarError(false);
                
                // Manually update the cache with the new avatar URL
                const queryKey = ['getProfileData', targetUser?.uuid];
                queryClient.setQueryData(queryKey, (oldData: ProfileDataResponse | undefined) => {
                    if (oldData) {
                        return {
                            ...oldData,
                            avatar_url: response.data.url
                        };
                    }
                    return oldData;
                });
                
                // Invalidate ALL user-related queries to refresh avatars everywhere
                await Promise.all([
                    queryClient.invalidateQueries({ queryKey: ['getActiveUsersData'] }),
                    queryClient.invalidateQueries({ queryKey: ['getInactiveUsersData'] }),
                    queryClient.invalidateQueries({ queryKey: ['getProfileData'] }),
                    // Invalidate any ticket-related queries that might show user avatars
                    queryClient.invalidateQueries({ queryKey: ['getTicketSummaryData'] }),
                    queryClient.invalidateQueries({ queryKey: ['getPendingTicketsData'] }),
                    queryClient.invalidateQueries({ queryKey: ['getClosedTicketsData'] }),
                    queryClient.invalidateQueries({ queryKey: ['getCancelledTicketsData'] })
                ]);
                
                // Update Inertia props to refresh AppBar avatar (only for current user)
                if (!targetUser || targetUser.uuid === user?.uuid) {
                    router.reload({ only: ['auth'] });
                }
                
                showSuccessAlert("Profile picture updated successfully!");
            },
            onError: (error: any) => {
                setIsProfilePictureLoading(false);
                // TODO: Add proper error handling/alert
            },
        });

    // PROFILE PICTURE DELETE MUTATION
    const { mutate: deleteProfilePictureMutation, isPending: deleteProfilePictureIsPending } =
        useDynamicMutation({
            mutationFn: (_: void) => {
                // CHECK IF USER CAN UPLOAD PROFILE PICTURE
                if (canUploadProfilePicture() && targetUser && targetUser.uuid !== user?.uuid) {
                    return deleteProfilePictureByUuid(targetUser.uuid);
                } else {
                    return deleteProfilePicture();
                }
            },
            mutationKey: ['getProfileData', targetUser?.uuid, 'getActiveUsersData', 'getInactiveUsersData'],
            onSuccess: async (response: DeleteProfilePictureResponse) => {
                setIsProfilePictureLoading(false);
                setIsModalOpen(false);
                
                // Reset avatar error state
                setAvatarError(false);
                
                // Manually update the cache to remove the avatar URL
                const queryKey = ['getProfileData', targetUser?.uuid];
                queryClient.setQueryData(queryKey, (oldData: ProfileDataResponse | undefined) => {
                    if (oldData) {
                        return {
                            ...oldData,
                            avatar_url: null
                        };
                    }
                    return oldData;
                });
                
                // Invalidate user lists to refresh profile pictures
                await Promise.all([
                    queryClient.invalidateQueries({ queryKey: ['getActiveUsersData'] }),
                    queryClient.invalidateQueries({ queryKey: ['getInactiveUsersData'] })
                ]);
                
                showSuccessAlert("Profile picture removed successfully!");
            },
            onError: (error: any) => {
                setIsProfilePictureLoading(false);
                // TODO: Add proper error handling/alert
            },
        });



    // Get recent activities or show fallback
    const recentActivities = profileData?.recent_activities || [];
    
    // Fallback activity when no recent activities exist
    const fallbackActivity = {
        type: 'Welcome',
        title: 'Welcome to your profile',
        description: 'No recent activities yet. Start by assigning tickets to see your activity feed.',
        time: 'Just now',
        icon: '👋',
        status: 'welcome',
        priority: 'low'
    };
    
    const activities = recentActivities.length > 0 ? recentActivities : [fallbackActivity];

    const allStats = [
        { 
            label: 'Total Tickets', 
            value: profileData?.user_ticket_counts?.total_tickets?.toString() || '0', 
            color: '#263238' // blueGrey[900] - for total tickets
        },
        { 
            label: 'Assigned Tickets', 
            value: profileData?.user_ticket_counts?.assigned_tickets?.toString() || '0', 
            color: '#1b5e20' // green[900] - same as assigned status
        },
        { 
            label: 'Returned Tickets', 
            value: profileData?.user_ticket_counts?.returned_tickets?.toString() || '0', 
            color: '#e65100' // orange[900] - same as returned status
        },
        { 
            label: 'Resubmitted Tickets', 
            value: profileData?.user_ticket_counts?.resubmitted_tickets?.toString() || '0', 
            color: '#4a148c' // deepPurple[900] - same as resubmitted status
        },
        { 
            label: 'Closed Tickets', 
            value: profileData?.user_ticket_counts?.closed_tickets?.toString() || '0', 
            color: '#263238' // blueGrey[900] - same as closed status
        },
        { 
            label: 'Re-open Tickets', 
            value: profileData?.user_ticket_counts?.reopen_tickets?.toString() || '0', 
            color: '#b71c1c' // red[900] - same as re-open status
        },
        { 
            label: 'Cancelled Tickets', 
            value: profileData?.user_ticket_counts?.cancelled_tickets?.toString() || '0', 
            color: '#b71c1c' // red[900] - same as cancelled status
        },
    ];

    // Filter out stats with zero values
    const stats = allStats.filter(stat => parseInt(stat.value) > 0);

    return (
        <AuthenticatedLayout>
            {isPendingProfileData ? (
                <ProfileSkeleton />
            ) : (
                <>
                    <Box sx={{
                        background: '#f8f9fa',
                        minHeight: '100vh',
                        py: 4
                    }}>
                        <Head title="Profile" />

                        <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
                            {/* MAIN CONTENT */}
                            <Grid container spacing={{ xs: 1, sm: 2, lg: 3 }}>
                                {/* LEFT COLUMN */}
                                <Grid sx={{
                                    width: { xs: '100%', lg: '400px' },
                                    flexShrink: 0,
                                    minWidth: { xs: 'auto', lg: '400px' },
                                    order: { xs: 1, lg: 1 }
                                }}>
                                    <Stack spacing={3}>
                                        <ProfileInformationCard
                                            profileData={profileData}
                                            avatarError={avatarError}
                                            onAvatarLoad={handleAvatarLoad}
                                            onAvatarError={handleAvatarError}
                                            onImageClick={handleImageClick}
                                            fileInputRef={fileInputRef}
                                            onImageChange={handleImageChange}
                                            targetUser={targetUser}
                                            canUploadProfilePicture={canUploadProfilePicture}
                                        />
                                        
                                        {/* Support Agents Card - Only show for Team Leaders */}
                                        {profileData?.roles?.[0]?.name === 'Team Leader' && (
                                            <SupportAgentsCard supportAgents={profileData?.support_agents || []} />
                                        )}
                                        
                                        {/* Team Leader Card - Only show for Support Agents */}
                                        {profileData?.roles?.[0]?.name === 'Support Agent' && profileData?.team_leader && (
                                            <TeamLeaderCard teamLeader={profileData.team_leader} />
                                        )}

                                    </Stack>
                                </Grid>

                                {/* RIGHT COLUMN - ACTIVITY FEED AND STATS */}
                                <Grid sx={{
                                    flex: 1,
                                    order: { xs: 2, lg: 2 }
                                }}>
                                    <Grid container spacing={{ xs: 2, sm: 3 }} sx={{
                                        flexDirection: { xs: 'column', lg: 'row' }
                                    }}>
                                        {/* Activity Feed Column */}
                                        <Grid sx={{
                                            width: { xs: '100%', lg: 'auto' },
                                            flex: { lg: 1 },
                                            minWidth: 0,
                                            order: { xs: 1, lg: 1 }
                                        }}>
                                            <Card sx={{
                                                background: 'rgba(255, 255, 255, 0.9)',
                                                backdropFilter: 'blur(10px)',
                                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                                borderRadius: 3,
                                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                                            }}>
                                                <Tabs
                                                    value={tabValue}
                                                    onChange={handleTabChange}
                                                    sx={{
                                                        borderBottom: 1,
                                                        borderColor: 'rgba(0, 0, 0, 0.1)',
                                                        '& .MuiTab-root': {
                                                            textTransform: 'none',
                                                            fontWeight: 600,
                                                            fontSize: '1rem',
                                                            minHeight: 64,
                                                            '&.Mui-selected': {
                                                                color: blue[600],
                                                            }
                                                        },
                                                        '& .MuiTabs-indicator': {
                                                            height: 3,
                                                            borderRadius: 2,
                                                            bgcolor: blue[600]
                                                        }
                                                    }}
                                                >
                                                    <Tab
                                                        icon={<FaHistory />}
                                                        iconPosition="start"
                                                        label="Activity Feed"
                                                    />
                                                    {/* ONLY SHOW SECURITY TAB IF VIEWING OWN PROFILE */}
                                                    {(!targetUser || targetUser.uuid === user?.uuid) && (
                                                        <Tab
                                                            icon={<FaLock />}
                                                            iconPosition="start"
                                                            label="Security"
                                                        />
                                                    )}
                                                </Tabs>

                                                <TabPanel value={tabValue} index={0}>
                                                    <ActivityFeedTab activities={activities} />
                                                </TabPanel>

                                                {/* CHANGE PASSWORD TAB */}
                                                <TabPanel value={tabValue} index={1}>
                                                    <SecurityTab onErrorFieldScroll={() => {}} />
                                                </TabPanel>
                                            </Card>
                                        </Grid>

                                        {/* Stats Cards Column */}
                                        <Grid sx={{
                                            width: { xs: '100%', lg: '300px' },
                                            flexShrink: 0,
                                            minWidth: { xs: 'auto', lg: '300px' },
                                            order: { xs: 2, lg: 2 }
                                        }}>
                                            <StatsCards stats={stats} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Container>
                    </Box>

                    {/* PROFILE PICTURE MODAL */}
                    <ProfilePictureModal
                        open={isModalOpen}
                        onClose={() => {
                            setIsModalOpen(false);
                            setSelectedFile(null);
                            setIsProfilePictureLoading(false);
                            // Clear the file input value
                            if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                            }
                        }}
                        onSave={(file: File) => {
                            setIsProfilePictureLoading(true);
                            uploadProfilePictureMutation(file);
                        }}
                        onRemove={() => {
                            setIsProfilePictureLoading(true);
                            deleteProfilePictureMutation(undefined);
                        }}
                        selectedFile={selectedFile}
                        currentProfilePicture={profileData?.avatar_url}
                        isPendingProfilePicture={isPendingProfilePicture}
                    />
                </>
            )}
        </AuthenticatedLayout>
    );
}
