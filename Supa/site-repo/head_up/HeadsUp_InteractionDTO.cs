using WORK.Entities.WORK;

namespace WORK.Rpc.heads_up.DTO;

public class HeadsUp_ReactionDTO
{
    public long HeadsUpId { get; set; }
    public long EmojiId { get; set; }
}

public class HeadsUp_MarkInteractionDTO
{
    public long HeadsUpId { get; set; }
}
