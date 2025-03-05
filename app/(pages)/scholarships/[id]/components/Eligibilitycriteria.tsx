
import React from 'react';
import Image from 'next/image';

interface EligibilityItem {
  _id?: string;
  name: string;
  detail: string;
}

interface EligibilityCriteriaProps {
  eligibilityCriteria: EligibilityItem[];
}

const Eligibilitycriteria: React.FC<EligibilityCriteriaProps> = ({ eligibilityCriteria }) => {
  return (
    <div>
      <section className="w-[90%] mx-auto pb-5">
        <div className="text-center md:w-3/5 mx-auto">
          <h3 className="font-bold text-2xl mb-2">Eligibility Criteria!</h3>
          <p className="md:py-4">
            To be eligible for the Global Korea Scholarship, applicants must meet specific academic, age, and residency requirements.
          </p>
        </div>

        {/* Dynamic Mapping of Eligibility Criteria */}
        <div className="w-full mx-auto space-y-4">
          {eligibilityCriteria.map((criteria, index) => (
            <div key={criteria._id || index} className="flex items-start space-x-2">
              <Image
                src="/scholarshipdetail/ellipse.png"
                width={12}
                height={12}
                alt="icon"
                className="2xl:w-[28px]"
              />
              <div>
                <p className="font-bold">{criteria.name}</p>
                {criteria.detail && (
                  <p className="text-[12px] 2xl:text-2xl">{criteria.detail}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Eligibilitycriteria;
