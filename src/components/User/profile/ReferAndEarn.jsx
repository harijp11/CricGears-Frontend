import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

const UserReferral = () => {
  const userData = useSelector((state) => state.user.userDatas);
  const [copied, setCopied] = useState(false);

  const handleCopyReferral = async () => {
    try {
      await navigator.clipboard.writeText(userData.referralCode);
      setCopied(true);
      toast.success('Referral code copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy referral code');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Join me on our platform!',
      text: `Use my referral code ${userData.referralCode} to get ₹200 in your wallet!`,
      url: window.location.origin + '/signup' + " " + 'Join me on our platform!' +  " " + `Use my referral code ${userData.referralCode} to get ₹200 in your wallet!`
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(
          `Join me on ${window.location.origin}! Use my referral code: ${userData.referralCode} to get ₹200 in your wallet!`
        );
        toast.success('Referral message copied to clipboard!');
      }
    } catch (err) {
      toast.error('Failed to share');
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-gray-100 rounded-lg shadow-md p-12 mt-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Refer & Earn</h2>
        <p className="text-gray-600 mb-6">
          Share your referral code with friends and both of you will get ₹200 in your wallet when they sign up!
        </p>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Your Referral Code</p>
              <div className="flex items-center gap-3">
                <span className="text-xl font-semibold">{userData.referralCode}</span>
                <button
                  onClick={handleCopyReferral}
                  className={`px-4 py-2 rounded ${
                    copied ? 'bg-green-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                  } transition-colors`}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
            
            <button
              onClick={handleShare}
              className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors"
            >
              Share with Friends
            </button>
          </div>
          
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">How it works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                  1
                </div>
                <p>Share your unique referral code with friends</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                  2
                </div>
                <p>They sign up using your referral code</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                  3
                </div>
                <p>Both of you get ₹200 in your wallets!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserReferral;