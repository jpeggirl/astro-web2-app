import React, { useState } from 'react';
import styled from 'styled-components';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '../../styles/theme';
import { UserProfile, RelationshipStatus } from '../../services/api'; // Import UserProfile and RelationshipStatus

// Define Gender options type
export type GenderOption = 'female' | 'male' | 'prefer not to disclose';

// Define props interface - accept UserProfile for initial values
interface BirthDateFormProps {
  initialProfile?: Partial<UserProfile>; // Accept partial UserProfile
  onSubmit: (profile: UserProfile) => void; // Submit full UserProfile
  onCancel?: () => void;
}

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  padding: ${SPACING.LARGE}px;
`;

const MainTitle = styled.h1`
  color: ${COLORS.NEON_PURPLE};
  font-size: ${parseInt(TYPOGRAPHY.HEADLINE.fontSize) * 1.5}px;
  text-align: center;
  margin-bottom: ${SPACING.EXTRA_LARGE}px;
  text-shadow: 0 0 10px ${COLORS.NEON_PURPLE};
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  padding: ${SPACING.LARGE}px;
  background-color: rgba(30, 30, 40, 0.9);
  border: 2px solid ${COLORS.NEON_GREEN};
  border-radius: 12px;
  ${SHADOWS.NEON_GREEN}
  max-width: 450px;
  width: 100%;
  margin: 0 auto;
  backdrop-filter: blur(10px);
`;

const FormTitle = styled.h3`
  color: ${COLORS.NEON_PURPLE};
  font-size: ${TYPOGRAPHY.SUBHEADLINE.fontSize};
  text-align: center;
  margin-bottom: ${SPACING.LARGE}px;
`;

const InputRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${SPACING.MEDIUM}px;
`;

const InputLabel = styled.label`
  color: ${COLORS.WHITE};
  font-size: ${TYPOGRAPHY.BODY.fontSize};
  margin-bottom: ${SPACING.SMALL}px;
  display: block;
`;

const InputField = styled.input`
  background-color: rgba(0, 0, 0, 0.5);
  border: 1px solid ${COLORS.NEON_GREEN};
  border-radius: 6px;
  color: ${COLORS.WHITE};
  padding: ${SPACING.SMALL}px ${SPACING.MEDIUM}px;
  font-size: ${TYPOGRAPHY.BODY.fontSize};
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${COLORS.NEON_PURPLE};
    box-shadow: 0 0 8px ${COLORS.NEON_PURPLE};
  }

  // Hide browser default number input spinners
  &[type=number] {
    -moz-appearance: textfield;
  }
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const SelectField = styled.select`
  background-color: rgba(0, 0, 0, 0.5);
  border: 1px solid ${COLORS.NEON_GREEN};
  border-radius: 6px;
  color: ${COLORS.WHITE};
  padding: ${SPACING.SMALL}px ${SPACING.MEDIUM}px;
  font-size: ${TYPOGRAPHY.BODY.fontSize};
  width: 100%;
  box-sizing: border-box;
  appearance: none; // Basic reset for custom arrow later if needed

  &:focus {
    outline: none;
    border-color: ${COLORS.NEON_PURPLE};
    box-shadow: 0 0 8px ${COLORS.NEON_PURPLE};
  }
`;

const InputWrapper = styled.div`
  flex: 1;
  margin-right: ${SPACING.SMALL}px;
  &:last-child {
    margin-right: 0;
  }
`;

const FullWidthWrapper = styled.div`
  width: 100%;
  margin-bottom: ${SPACING.MEDIUM}px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: ${SPACING.LARGE}px;
`;

const SubmitButton = styled.button`
  background-color: ${COLORS.NEON_PURPLE};
  border: none;
  border-radius: 20px;
  padding: ${SPACING.SMALL}px ${SPACING.LARGE}px;
  color: ${COLORS.BLACK};
  font-size: ${TYPOGRAPHY.BUTTON.fontSize};
  font-weight: ${TYPOGRAPHY.BUTTON.fontWeight};
  cursor: pointer;
  transition: background-color 0.2s ease;
  ${SHADOWS.NEON_PURPLE}

  &:hover {
    background-color: #c84dff; // Lighter purple on hover
  }

  &:disabled {
    background-color: ${COLORS.DARK_GRAY};
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const CancelButton = styled.button`
  background-color: transparent;
  border: 2px solid ${COLORS.GRAY};
  border-radius: 20px;
  padding: ${SPACING.SMALL}px ${SPACING.LARGE}px;
  color: ${COLORS.GRAY};
  font-size: ${TYPOGRAPHY.BUTTON.fontSize};
  font-weight: ${TYPOGRAPHY.BUTTON.fontWeight};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${COLORS.WHITE};
    color: ${COLORS.WHITE};
  }
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
  margin-bottom: ${SPACING.MEDIUM}px;
  font-size: 0.9rem;
`;

// Gender options array
const GENDER_OPTIONS: GenderOption[] = [
  'female',
  'male',
  'prefer not to disclose'
];

const RELATIONSHIP_STATUS_OPTIONS: RelationshipStatus[] = [
  'single',
  'dating',
  'engaged',
  'married',
  'just broke up'
];

// Generate time options
const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

export const BirthDateForm: React.FC<BirthDateFormProps> = ({ initialProfile, onSubmit, onCancel }) => {
  const [month, setMonth] = useState<string>(initialProfile?.birthMonth?.toString() || '');
  const [day, setDay] = useState<string>(initialProfile?.birthDay?.toString() || '');
  const [year, setYear] = useState<string>(initialProfile?.birthYear?.toString() || '');
  const [hour, setHour] = useState<string>(initialProfile?.birthTime?.hour.toString().padStart(2, '0') || ''); // Add hour state
  const [minute, setMinute] = useState<string>(initialProfile?.birthTime?.minute.toString().padStart(2, '0') || ''); // Add minute state
  const [gender, setGender] = useState<GenderOption | ''>(initialProfile?.gender as GenderOption || ''); // Use GenderOption type
  const [birthPlace, setBirthPlace] = useState<string>(initialProfile?.birthPlace || '');
  const [relationshipStatus, setRelationshipStatus] = useState<RelationshipStatus | ''>(initialProfile?.relationshipStatus || '');
  const [error, setError] = useState<string>('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    const monthNum = parseInt(month, 10);
    const dayNum = parseInt(day, 10);
    const yearNum = parseInt(year, 10);

    // Basic Validation
    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      setError('Invalid Month (1-12)');
      return;
    }
    if (isNaN(dayNum) || dayNum < 1 || dayNum > 31) {
      setError('Invalid Day (1-31)');
      return;
    }
    const currentYear = new Date().getFullYear();
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > currentYear) {
      setError(`Invalid Year (1900-${currentYear})`);
      return;
    }

    // Validate time if both hour and minute are entered
    let birthTimeData: { hour: number; minute: number } | undefined = undefined;
    const hourNum = parseInt(hour, 10);
    const minuteNum = parseInt(minute, 10);

    if (hour !== '' && minute !== '') { // Only validate if both are selected
        if (isNaN(hourNum) || hourNum < 0 || hourNum > 23) {
            setError('Invalid Hour (0-23)');
            return;
        }
        if (isNaN(minuteNum) || minuteNum < 0 || minuteNum > 59) {
            setError('Invalid Minute (0-59)');
            return;
        }
        birthTimeData = { hour: hourNum, minute: minuteNum };
    } else if (hour !== '' || minute !== '') {
        // If only one is filled, treat as incomplete (optional)
        console.warn("Birth time is incomplete, submitting without it.");
        // Alternatively, set an error: setError('Please select both hour and minute or leave both blank.'); return;
    }

    // Add basic check for required fields (optional fields are fine)
    if (!birthPlace.trim()) {
        console.warn("Birth Place field is empty but proceeding.");
       // setError('Birth Place is required'); // Uncomment if making required
       // return;
    }
    if (!relationshipStatus) {
       console.warn("Relationship Status field is empty but proceeding.");
       // setError('Relationship Status is required'); // Uncomment if making required
       // return;
    }

    const profileData: UserProfile = {
      birthMonth: monthNum,
      birthDay: dayNum,
      birthYear: yearNum,
      birthTime: birthTimeData, // Add birth time data
      gender: gender || undefined, // Send selected gender or undefined
      birthPlace: birthPlace.trim() || undefined, // Send undefined if empty
      relationshipStatus: relationshipStatus || undefined // Send undefined if empty
    };

    onSubmit(profileData);
  };

  return (
    <PageContainer>
      <MainTitle>Welcome to AstroApp</MainTitle>
      <FormContainer onSubmit={handleSubmit}>
        <FormTitle>Enter Your Details</FormTitle>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        {/* Birth Date Row */}
        <InputLabel>Birth Date</InputLabel>
        <InputRow>
          <InputWrapper>
            <InputField
              id="birthMonth"
              type="number"
              placeholder="MM"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              min="1"
              max="12"
              required
              aria-label="Birth Month"
            />
          </InputWrapper>
          <InputWrapper>
            <InputField
              id="birthDay"
              type="number"
              placeholder="DD"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              min="1"
              max="31"
              required
              aria-label="Birth Day"
            />
          </InputWrapper>
          <InputWrapper>
            <InputField
              id="birthYear"
              type="number"
              placeholder="YYYY"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              min="1900"
              max={new Date().getFullYear().toString()}
              required
              aria-label="Birth Year"
            />
          </InputWrapper>
        </InputRow>

        {/* Birth Time Row */}
        <InputLabel>Birth Time (Optional)</InputLabel>
        <InputRow>
          <InputWrapper>
            <SelectField
              id="birthHour"
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              aria-label="Birth Hour"
            >
              <option value="">Hour</option>
              {HOURS.map(hr => (
                <option key={hr} value={hr}>{hr}</option>
              ))}
            </SelectField>
          </InputWrapper>
          <InputWrapper>
            <SelectField
              id="birthMinute"
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
              aria-label="Birth Minute"
            >
              <option value="">Minute</option>
              {MINUTES.map(min => (
                <option key={min} value={min}>{min}</option>
              ))}
            </SelectField>
          </InputWrapper>
        </InputRow>

        {/* Gender Row - Changed to SelectField */}
        <FullWidthWrapper>
          <InputLabel htmlFor="gender">Gender</InputLabel>
          <SelectField
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value as GenderOption | '')}
            // required // Make required if needed
          >
            <option value="">Select Gender (Optional)</option>
            {GENDER_OPTIONS.map(option => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)} 
              </option>
            ))}
          </SelectField>
        </FullWidthWrapper>

        {/* Birth Place Row */}
        <FullWidthWrapper>
          <InputLabel htmlFor="birthPlace">Birth Place</InputLabel>
          <InputField
            id="birthPlace"
            type="text"
            placeholder="City, Country (Optional)"
            value={birthPlace}
            onChange={(e) => setBirthPlace(e.target.value)}
            maxLength={100}
          />
        </FullWidthWrapper>

        {/* Relationship Status Row */}
        <FullWidthWrapper>
          <InputLabel htmlFor="relationshipStatus">Relationship Status</InputLabel>
          <SelectField
            id="relationshipStatus"
            value={relationshipStatus}
            onChange={(e) => setRelationshipStatus(e.target.value as RelationshipStatus | '')}
          >
            <option value="">Select status (Optional)</option>
            {RELATIONSHIP_STATUS_OPTIONS.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)} 
              </option>
            ))}
          </SelectField>
        </FullWidthWrapper>

        <ButtonGroup>
          {onCancel && (
            <CancelButton type="button" onClick={onCancel}>
              Cancel
            </CancelButton>
          )}
          <SubmitButton type="submit">
            Save & Get Reading
          </SubmitButton>
        </ButtonGroup>
      </FormContainer>
    </PageContainer>
  );
};

export default BirthDateForm; 