"use client";

import { useFieldArray, UseFormRegister, Control } from "react-hook-form";
import { DEFAULT_ACHIEVEMENT_TIERS, AchievementTierInput } from "@/lib/validations/tournament";

interface AchievementTiersSectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
}

export function AchievementTiersSection({ control, register }: AchievementTiersSectionProps) {
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "achievement_tiers",
  });

  const handleUseDefaults = () => {
    replace(DEFAULT_ACHIEVEMENT_TIERS);
  };

  const handleAddTier = () => {
    const nextOrder = fields.length + 1;
    const typedFields = fields as unknown as AchievementTierInput[];
    const lastMax = typedFields.length > 0 ? typedFields[typedFields.length - 1].max_position : 0;
    append({
      min_position: lastMax + 1,
      max_position: lastMax + 4,
      title: "",
      color: "#6B7280",
      icon: "star",
      display_order: nextOrder,
    });
  };

  const typedFields = fields as unknown as (AchievementTierInput & { id: string })[];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-300">Danh hiệu giải đấu</h3>
        <button
          type="button"
          onClick={handleUseDefaults}
          className="text-xs px-3 py-1.5 bg-gold-accent/20 text-gold-accent rounded-lg hover:bg-gold-accent/30 transition-colors"
        >
          Dùng mặc định
        </button>
      </div>

      {typedFields.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-white/10 rounded-xl">
          <span className="material-symbols-outlined text-3xl text-gray-500 mb-2">
            emoji_events
          </span>
          <p className="text-sm text-gray-500">Chưa có danh hiệu nào</p>
          <button
            type="button"
            onClick={handleUseDefaults}
            className="mt-3 text-sm text-gold-accent hover:underline"
          >
            Thêm danh hiệu mặc định
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {typedFields.map((field, index) => (
            <div
              key={field.id}
              className="p-4 bg-card-dark rounded-xl border border-white/5"
            >
              {/* Header with preview and remove button */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-lg shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: (field.color || "#6B7280") + "30" }}
                  >
                    <span
                      className="material-symbols-outlined text-xl"
                      style={{ color: field.color || "#6B7280" }}
                    >
                      {field.icon || "emoji_events"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {field.title || "Chưa đặt tên"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Hạng {field.min_position} - {field.max_position}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>

              {/* Form fields - stacked layout */}
              <div className="space-y-4">
                {/* Row 1: Title */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    Tên danh hiệu
                  </label>
                  <input
                    type="text"
                    {...register(`achievement_tiers.${index}.title`)}
                    placeholder="Nhà Vô Địch"
                    className="w-full px-3 py-2.5 text-sm bg-dark-bg border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:border-gold-accent focus:outline-none"
                  />
                </div>

                {/* Row 2: Position range */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    Phạm vi thứ hạng
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <input
                        type="number"
                        min={1}
                        {...register(`achievement_tiers.${index}.min_position`, { valueAsNumber: true })}
                        placeholder="Từ"
                        className="w-full px-3 py-2.5 text-sm bg-dark-bg border border-white/10 rounded-lg text-white focus:border-gold-accent focus:outline-none"
                      />
                    </div>
                    <span className="text-gray-500 text-sm">đến</span>
                    <div className="flex-1">
                      <input
                        type="number"
                        min={1}
                        {...register(`achievement_tiers.${index}.max_position`, { valueAsNumber: true })}
                        placeholder="Đến"
                        className="w-full px-3 py-2.5 text-sm bg-dark-bg border border-white/10 rounded-lg text-white focus:border-gold-accent focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Hidden fields for color and icon - hardcoded for now */}
                <input type="hidden" {...register(`achievement_tiers.${index}.color`)} />
                <input type="hidden" {...register(`achievement_tiers.${index}.icon`)} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add tier button */}
      <button
        type="button"
        onClick={handleAddTier}
        className="w-full py-2 border border-dashed border-white/10 rounded-xl text-sm text-gray-400 hover:text-white hover:border-white/20 transition-colors flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined text-lg">add</span>
        Thêm danh hiệu
      </button>
    </div>
  );
}
