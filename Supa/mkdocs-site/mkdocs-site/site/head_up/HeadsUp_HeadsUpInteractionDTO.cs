using WORK.Entities.WORK;

namespace WORK.Rpc.heads_up.DTO
{
    public class HeadsUp_HeadsUpInteractionDTO : DataDTO
    {
        public long Id { get; set; }
        public long HeadsUpId { get; set; }
        public long AppUserId { get; set; }
        public DateTime ViewedAt { get; set; }
        public DateTime? AcknowledgedAt { get; set; }
        public HeadsUp_AppUserDTO AppUser { get; set; }

        public HeadsUp_HeadsUpInteractionDTO() { }

        public HeadsUp_HeadsUpInteractionDTO(HeadsUpInteraction interaction)
        {
            Id = interaction.Id;
            HeadsUpId = interaction.HeadsUpId;
            AppUserId = interaction.AppUserId;
            ViewedAt = interaction.ViewedAt;
            AcknowledgedAt = interaction.AcknowledgedAt;
            AppUser = interaction.AppUser == null ? null : new HeadsUp_AppUserDTO(interaction.AppUser);
        }
    }

    public class HeadsUp_HeadsUpInteractionFilterDTO : FilterDTO
    {
        public IdFilter HeadsUpId { get; set; }
        public IdFilter AppUserId { get; set; }
        public bool? IsAcknowledged { get; set; }

        public HeadsUpInteractionFilter ToFilterEntity()
        {
            return new HeadsUpInteractionFilter
            {
                Skip = Skip,
                Take = Take,
                HeadsUpId = HeadsUpId,
                AppUserId = AppUserId,
                IsAcknowledged = IsAcknowledged
            };
        }
    }
}
