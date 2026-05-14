using WORK.Entities.WORK;

namespace WORK.Rpc.heads_up.DTO
{
    public class HeadsUp_HeadsUpReactionDTO : DataDTO
    {
        public long AppUserId { get; set; }
        public long EmojiId { get; set; }
        public HeadsUp_AppUserDTO AppUser { get; set; }
        public HeadsUp_EmojiDTO Emoji { get; set; }

        public HeadsUp_HeadsUpReactionDTO() { }

        public HeadsUp_HeadsUpReactionDTO(HeadsUpReaction reaction)
        {
            AppUserId = reaction.AppUserId;
            EmojiId = reaction.EmojiId;
            AppUser = reaction.AppUser == null ? null : new HeadsUp_AppUserDTO(reaction.AppUser);
            Emoji = reaction.Emoji == null ? null : new HeadsUp_EmojiDTO(reaction.Emoji);
            Errors = reaction.Errors;
        }

        public HeadsUpReaction ToEntity(ICurrentContext CurrentContext)
        {
            return new HeadsUpReaction
            {
                AppUserId = this.AppUserId,
                EmojiId = this.EmojiId,
                BaseLanguage = CurrentContext.Language
            };
        }
    }
}
